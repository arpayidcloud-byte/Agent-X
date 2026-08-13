export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold tracking-tight text-[#f7f8f8]">id-tech<span className="text-[#7170ff]">.cloud</span></p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#62666d]">Infrastructure untuk membangun, menjalankan, dan mengukur AI agent secara serius.</p>
        </div>
        <div><p className="footer-heading">Product</p><div className="footer-links"><a href="#fitur">Fitur</a><a href="#pricing">Harga</a><a href="#faq">FAQ</a></div></div>
        <div><p className="footer-heading">Workspace</p><div className="footer-links"><a href="https://app.id-tech.cloud">App</a><a href="https://panel.id-tech.cloud">Panel</a><a href="https://api.id-tech.cloud">API</a></div></div>
        <div><p className="footer-heading">Contact</p><div className="footer-links"><a href="mailto:hello@id-tech.cloud">hello@id-tech.cloud</a><a href="mailto:security@id-tech.cloud">Security</a></div></div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/[0.05] px-6 py-5 text-xs text-[#62666d] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 id-tech.cloud</span><span>Built for teams that ship.</span></div>
    </footer>
  );
}
