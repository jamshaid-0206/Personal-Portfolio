import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  projectType: z.string().min(1, { message: 'Please pick what you need.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const PROJECT_TYPES = [
  { value: 'fullstack', label: 'Full-stack app' },
  { value: 'frontend', label: 'Website / Frontend' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'ai', label: 'AI integration' },
  { value: 'consult', label: 'Consulting' },
];

const shake = { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.35 } };

const field =
  'peer w-full border-0 border-b border-foreground/20 bg-transparent px-0 pb-3 pt-7 text-xl text-foreground placeholder-transparent transition-colors focus:border-emerald-500 focus:outline-none focus:ring-0 md:text-2xl';
const floatLabel =
  'pointer-events-none absolute left-0 top-7 text-xl text-muted-foreground transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-500 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs md:text-2xl md:peer-focus:text-xs md:peer-[:not(:placeholder-shown)]:text-xs';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', projectType: '', message: '' },
  });
  const selected = watch('projectType');

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent — I'll get back to you within 24–48 hours.", {
      icon: <Check className="text-emerald-500" size={16} />,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-10 text-left" noValidate>
      <fieldset>
        <legend className="mb-4 text-sm text-muted-foreground">I'm interested in…</legend>
        <motion.div animate={errors.projectType ? shake : { x: 0 }} className="flex flex-wrap gap-2.5">
          {PROJECT_TYPES.map((t) => {
            const on = selected === t.value;
            return (
              <label
                key={t.value}
                className={cn(
                  'cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500',
                  on ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-foreground/15 text-foreground hover:border-foreground/40'
                )}
              >
                <input type="radio" value={t.value} {...register('projectType')} className="sr-only" />
                {t.label}
              </label>
            );
          })}
        </motion.div>
        {errors.projectType && <p className="mt-2 text-sm text-rose-500">{errors.projectType.message}</p>}
      </fieldset>

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div animate={errors.name ? shake : { x: 0 }} className="relative">
          <input id="name" type="text" placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} className={field} />
          <label htmlFor="name" className={floatLabel}>
            Your name
          </label>
          {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name.message}</p>}
        </motion.div>
        <motion.div animate={errors.email ? shake : { x: 0 }} className="relative">
          <input id="email" type="email" placeholder="Email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} className={field} />
          <label htmlFor="email" className={floatLabel}>
            Email address
          </label>
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
        </motion.div>
      </div>

      <motion.div animate={errors.message ? shake : { x: 0 }} className="relative">
        <textarea id="message" rows={4} placeholder="Message" aria-invalid={!!errors.message} {...register('message')} className={cn(field, 'resize-none')} />
        <label htmlFor="message" className={floatLabel}>
          Tell me about your project
        </label>
        {errors.message && <p className="mt-2 text-sm text-rose-500">{errors.message.message}</p>}
      </motion.div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-shine group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-emerald-500 px-8 py-5 text-base font-semibold text-black shadow-[0_10px_40px_-10px_rgba(16,185,129,0.8)] transition-transform duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
          </>
        )}
      </button>
    </form>
  );
}
