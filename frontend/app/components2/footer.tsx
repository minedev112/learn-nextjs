export default function Footer() {
  return (
    <footer className="border-t mt-16 border-gray-200">
      <div className="mx-auto max-w-6xl py-10 text-center">
        

        <ul className="mt-4 text-sm text-gray-500 flex justify-center gap-6">
          <li>
            <a href="#" className="hover:text-gray-700">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-700">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
          </li>
        </ul>

        <p className="mt-2 text-sm text-gray-500 font-weight-bold">
          Copyright © 2021 Food Ninja Blog. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}