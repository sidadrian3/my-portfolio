import GridContacts from "./grid-contacts";
export default function Page() {
  return (
    <>
      <div className="flex flex-col items-start py-2">
        <div className="transform">
          <h1 className="text-3xl font-bold mb-2">Contact Page</h1>
          <p className="text-sm mb-4">Feel free to reach out!</p>
        </div>
      </div>
      <div className="flex flex-col items-start py-2">
        <p className="text-sm mb-4">Connect through here.</p>
        <GridContacts />
      </div>
    </>
  );
}
