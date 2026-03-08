import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar mensagem');
      }

      console.log('Form data sent:', result);
      toast.success('Mensagem enviada com sucesso! Entrarei em contato em breve.');
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Entre em Contato
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tem um projeto em mente? Vamos conversar sobre como posso
                ajudar a tornar sua ideia realidade.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-6">Informações</h2>

                  <div className="space-y-4">
                    <a
                      href="mailto:davisantossousa2@gmail.com"
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">E-mail</p>
                        <p className="font-medium">davisantossousa2@gmail.com</p>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/5589981013110?text=Olá,%20vim%20pelo%20seu%20portfólio!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-[#25D366]/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-[#25D366]/10 transition-colors">
                        <Phone className="w-5 h-5 text-primary group-hover:text-[#25D366] transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone / WhatsApp</p>
                        <p className="font-medium">+55 89 98101-3110</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/DaviSantos040910"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm">
                    💡 <strong>Dica:</strong> Quanto mais detalhes sobre seu
                    projeto você incluir, mais preciso será meu feedback inicial.
                  </p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-3"
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 rounded-xl bg-card border border-border"
                  >
                    <div className="p-4 rounded-full bg-primary/10 mb-6">
                      <CheckCircle className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
                    <p className="text-muted-foreground mb-6">
                      Obrigado pelo contato. Responderei o mais breve possível.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Enviar outra mensagem
                    </Button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 rounded-xl bg-card border border-border"
                  >
                    <h2 className="text-xl font-semibold mb-6">
                      Envie uma mensagem
                    </h2>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            placeholder="Seu nome"
                            {...register('name')}
                            className={errors.name ? 'border-destructive' : ''}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input
                          id="subject"
                          placeholder="Sobre o que você quer conversar?"
                          {...register('subject')}
                          className={errors.subject ? 'border-destructive' : ''}
                        />
                        {errors.subject && (
                          <p className="text-xs text-destructive">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                          id="message"
                          placeholder="Conte-me mais sobre seu projeto..."
                          rows={6}
                          {...register('message')}
                          className={errors.message ? 'border-destructive' : ''}
                        />
                        {errors.message && (
                          <p className="text-xs text-destructive">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
