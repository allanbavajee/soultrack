// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Si l'utilisateur arrive à la racine "/", on le redirige vers /login
  if (url.pathname === "/") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
