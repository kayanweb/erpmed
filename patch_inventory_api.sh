sed -i '/app.get("\/api\/inventory"/i \      app.post("/api/inventory/add", async (req, res) => {\
        try {\
          const data = req.body;\
          await clinicalDataService.saveItem("inventory", data);\
          res.json({ success: true, data });\
        } catch (e) {\
          res.status(500).json({ error: (e as Error).message });\
        }\
      });\
' server.ts
