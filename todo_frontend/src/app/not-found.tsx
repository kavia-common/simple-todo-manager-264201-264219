import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-12">
      <section className="container-ocean">
        <div
          className="card-ocean p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <h1 className="text-2xl font-semibold text-gray-900">404 – Page Not Found</h1>
          <p className="text-gray-600 mt-2">
            The page you’re looking for doesn’t exist.
          </p>
          <Link href="/" className="btn btn-primary inline-block mt-6" aria-label="Go back home">
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}
