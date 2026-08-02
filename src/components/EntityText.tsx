import React, { Fragment } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { EntityShape } from "../types";

export function parseEntityText(text: string, entities: EntityShape[], isAr: boolean, userRole?: string) {
  if (!text) return null;
  if (!entities || entities.length === 0) return <span>{text}</span>;

  // We want to replace occurrences of entity names or keywords with GlobalEntityLinks.
  // For safety and performance, we'll split the text by the entity names/keywords.
  // In a real production system, this could be driven by a robust NLP engine or regex.
  
  // Sort entities by name length descending so we match longest phrases first
  const sortedEntities = [...entities].filter(e => e.name).sort((a, b) => b.name!.length - a.name!.length);
  
  // Create a regex that matches any of the entity names
  const escapedNames = sortedEntities.map(e => e.name!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedNames.join('|')})`, 'gi');
  
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    // Find if this part matches an entity
    const matchedEntity = sortedEntities.find(e => e.name?.toLowerCase() === part?.toLowerCase());
    
    if (matchedEntity) {
      return (
        <Fragment key={index}>
          <GlobalEntityLink 
            entity={matchedEntity} 
            language={isAr ? "ar" : "en"}
            userRole={userRole}
          />
        </Fragment>
      );
    }
    
    return <span key={index}>{part}</span>;
  });
}

export function EntityText({ text, entities, isAr = false, className, userRole }: { text: string, entities?: EntityShape[], isAr?: boolean, className?: string, userRole?: string }) {
  // If no entities are explicitly provided, we could try to infer them, 
  // but for now we expect them to be passed if we want them linked.
  return (
    <span className={className}>
      {entities ? parseEntityText(text, entities, isAr, userRole) : text}
    </span>
  );
}
