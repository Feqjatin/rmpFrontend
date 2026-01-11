function Footer() {
    return ( <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
 
      <div>
        <h2 className="text-xl font-semibold text-white">Roima Recruitement</h2>
        <p className="mt-3 text-sm text-gray-400">
          Smart recruitment platform to manage hiring, candidates, and interviews efficiently.
        </p>
      </div>
 
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">About</a></li>
          <li><a href="#" className="hover:text-white">Careers</a></li>
          <li><a href="#" className="hover:text-white">Contact</a></li>
        </ul>
      </div>
 
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">Features</a></li>
          <li><a href="#" className="hover:text-white">Pricing</a></li>
          <li><a href="#" className="hover:text-white">Security</a></li>
        </ul>
      </div>
  
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white">Terms of Service</a></li>
        </ul>
      </div>
    </div>
  
    <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
      © {new Date().getFullYear()} HireEase. All rights reserved.
    </div>
  </footer>
    );
}
export default Footer;
     