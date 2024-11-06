import axios from "axios";
import {NextResponse} from "next/server";
import {ResponseError} from "amadeus-ts";

export async function POST(request: Request) {
    try {
        const { city } = await request.json()

        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        const openAIResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Give me 3 pros and 3 cons of visiting ${city}. Please Begin each pro with "Pro" and each con with "Con"`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const content = openAIResponse.data.choices[0].message.content;
        console.log(content)
        const prosCons = content.split("\n").filter((line: string | string[]) => line.includes("Pro") || line.includes("Con"));
        const pros = prosCons.filter((line: string | string[]) => line.includes("Pro")).map((line: string) => line.replace("Pro:", "").trim());
        const cons = prosCons.filter((line: string | string[]) => line.includes("Con")).map((line: string) => line.replace("Con:", "").trim());

        return NextResponse.json({pros, cons}, { status: 200 });
    } catch (error) {
        console.log(error)
        if (error instanceof ResponseError) {
            return NextResponse.json({ message: error.description }, { status: error.response.statusCode ?? 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
