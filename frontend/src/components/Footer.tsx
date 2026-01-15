import { ArrowUpRight } from "lucide-react";
const footerLinks = {
  Product: ["Features", "Pricing", "Download", "Changelog"],
  Safety: ["Trust & Safety", "Privacy Policy", "Community Guidelines", "Report"],
  Legal: ["Terms of Service", "Privacy", "Cookies", "Licenses"],
  Social: ["Twitter", "Instagram", "LinkedIn", "Discord"]
};
const Footer = () => {
  return <footer className="bg-surface-200 border-t border-border" id="download">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-xl font-bold tracking-tight text-foreground">
              LoveSync
            </a>
            <p className="text-sm text-text-secondary mt-4 max-w-xs">
              El motor de relaciones más detallado del mundo.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => <div key={category}>
              <h4 className="font-medium text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(link => <li key={link}>
                    <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                      {link}
                      {category === "Social" && <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} LoveSync. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-text-tertiary hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-text-tertiary hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-text-tertiary hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>

      {/* Giant Wordmark */}
      <div className="container mx-auto px-6 pb-8">
        <div className="text-[8vw] font-bold tracking-tighter text-surface-300 select-none leading-none">
          LoveSync
        </div>
      </div>
    </footer>;
};
export default Footer;