export const Footer = () => {
  return (
    <footer className="flex border-t justify-between font-medium p-6">
      <div className="flex items-center gap-2">
        <p className="flex items-center gap-2">
          &copy; {new Date().getFullYear()} Vendor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}