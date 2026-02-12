import React from "react";

const About: React.FC = () => {
  return (
    <main
      style={{ padding: 24, maxWidth: 900, margin: "0 auto", lineHeight: 1.6 }}
    >
      <header>
        <h1>About This App</h1>
        <p style={{ color: "#555" }}>
          A short description of the application, its purpose, and any
          high-level goals.
        </p>
      </header>

      <section aria-labelledby="what-we-do" style={{ marginTop: 24 }}>
        <h2 id="what-we-do">What we do</h2>
        <p>
          This project demonstrates a simple page built with React + TypeScript.
          It's intended to be a starting point for building out static content
          pages in your application.
        </p>
      </section>

      <section aria-labelledby="features" style={{ marginTop: 24 }}>
        <h2 id="features">Main features</h2>
        <ul>
          <li>Lightweight and accessible structure</li>
          <li>TypeScript + React functional component</li>
          <li>Easy to style or extend</li>
        </ul>
      </section>

      <section aria-labelledby="contact" style={{ marginTop: 24 }}>
        <h2 id="contact">Contact</h2>
        <p>
          For more information, link to documentation or provide contact details
          here.
        </p>
      </section>
    </main>
  );
};

export default About;
