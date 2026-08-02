#!/bin/bash
# Insert new routes into server.ts before the static file serving block

sed -i '/\/\/ --- UNIVERSAL ABSTRACTION DATABASE LAYER/i \
  app.get("/api/consumables", async (req, res) => {\
    try {\
      const data = await clinicalDataService.getCollection("consumables");\
      res.json(data);\
    } catch (e) {\
      res.status(500).json({ error: (e as Error).message });\
    }\
  });\
\
  app.get("/api/inventory", async (req, res) => {\
    try {\
      const data = await clinicalDataService.getCollection("inventory");\
      res.json(data);\
    } catch (e) {\
      res.status(500).json({ error: (e as Error).message });\
    }\
  });\
\
  app.get("/api/events", async (req, res) => {\
    try {\
      const data = await clinicalDataService.getCollection("events");\
      res.json(data);\
    } catch (e) {\
      res.status(500).json({ error: (e as Error).message });\
    }\
  });\
\
  app.get("/api/patients/:id/consumables", async (req, res) => {\
    try {\
      const patientId = req.params.id;\
      const patients = await clinicalDataService.getCollection("patients");\
      const patient = patients.find(p => p.id === patientId);\
      if (!patient) return res.status(404).json({ error: "Patient not found" });\
\
      const allConsumables = await clinicalDataService.getCollection("consumables");\
      const patientConsumables = allConsumables.filter(c => c.patientId === patientId);\
\
      const inventory = await clinicalDataService.getCollection("inventory");\
\
      res.json({ patient, consumables: patientConsumables, inventory });\
    } catch (e) {\
      res.status(500).json({ error: (e as Error).message });\
    }\
  });\
\
  app.post("/api/consumables/issue", async (req, res) => {\
    try {\
      const { patientId, itemName, quantity, store } = req.body;\
      const id = Date.now().toString();\
      const transactionNo = `TXN-${id}`;\
      const transactionDate = new Date().toISOString();\
      const newConsumable = {\
        id,\
        patientId,\
        itemName,\
        transactionNo,\
        store,\
        quantity: parseFloat(quantity),\
        status: "Confirmed",\
        transactionDate\
      };\
      await clinicalDataService.saveItem("consumables", newConsumable);\
\
      // Deduct inventory\
      const inventory = await clinicalDataService.getCollection("inventory");\
      let invItem = inventory.find(i => i.itemName === itemName && i.store === store);\
      if (invItem) {\
        invItem.currentQuantity = (parseFloat(invItem.currentQuantity) - parseFloat(quantity)).toString();\
        invItem.lastUpdated = transactionDate;\
        await clinicalDataService.saveItem("inventory", invItem);\
      }\
\
      // Add event\
      const event = {\
        id: Date.now().toString() + Math.random().toString().slice(2, 6),\
        eventType: "CONSUMABLE_ISSUED",\
        patientId,\
        payload: { consumable: newConsumable, transactionNo },\
        createdAt: transactionDate\
      };\
      await clinicalDataService.saveItem("events", event);\
\
      res.json({ success: true, data: newConsumable });\
    } catch (e) {\
      res.status(500).json({ error: (e as Error).message });\
    }\
  });\
' server.ts
