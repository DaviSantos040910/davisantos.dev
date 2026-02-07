import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl">DevPortfolio</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Desenvolvedor freelancer apaixonado por criar soluções digitais que fazem a diferença.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              <Link
                to="/projetos"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Projetos
              </Link>
              <Link
                to="/sobre"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sobre Mim
              </Link>
              <Link
                to="/contato"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contato
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Conecte-se</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@email.com"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} DevPortfolio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
