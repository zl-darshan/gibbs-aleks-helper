import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";
import { Welcome } from "../welcome/welcome";
import Migration from "./migration";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {

    return (
        <div className="flex justify-center h-full">
            <Form action="/migration">
                <button className="text-white px-4 py-2 rounded-md font-bold">Migration Arch 1 to Arch 2</button>
            </Form>
        </div>
    );
}
