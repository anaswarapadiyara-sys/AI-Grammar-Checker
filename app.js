import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import { GoogleGenAI } from "@google/genai";


dotenv.config()
const app = express()
const port = process.env.port || 3000
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
//to use ejs as view engine 
app.set("view engine", "ejs")
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.render("home", {
        corrected: null,
        originalText: null
    })
})

//main logic


app.post("/correct", async (req, res) => {

    const text = req.body.text?.trim();

    if (!text) {
        return res.render("home", {
            corrected: "Please enter some text to correct.",
            originalText: ""
        });
    }

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Correct the grammar of the following text. Return only the corrected text.\n\n${text}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            return res.render("home", {
                corrected: data.error?.message || "Something went wrong.",
                originalText: text
            });
        }

        const corrected =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.render("home", {
            corrected: corrected || "No correction returned.",
            originalText: text
        });

    } catch (error) {

        console.error("Error:", error);

        res.render("home", {
            corrected: "Error occurred while correcting text.",
            originalText: text
        });

    }

});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})