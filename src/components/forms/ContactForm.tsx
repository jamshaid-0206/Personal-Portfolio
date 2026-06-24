import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Terminal } from 'lucide-react';
import { motion } from 'motion/react';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  projectType: z.string().min(1, { message: "Please select a project category." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Physics-based shake animation variants for error states
const shakeVariants = {
  shake: {
    x: [0, -6, 6, -6, 6, 0],
    transition: { duration: 0.35, ease: 'easeInOut' }
  },
  default: { x: 0 }
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: '',
      message: '',
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate network API transmission latency
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    // Trigger terminal success prompt notification via sonner
    toast.success("Transmission complete — Reply queue scheduled within 24–48h.", {
      className: "font-mono border border-emerald-500/30 bg-black text-emerald-300 rounded-sm shadow-md",
      icon: <Terminal className="text-emerald-400" size={16} />,
      duration: 5000,
    });
    
    reset();
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 w-full text-left"
      noValidate
    >
      {/* Name Input Field Wrapper */}
      <motion.div 
        animate={errors.name ? "shake" : "default"}
        variants={shakeVariants}
        className="space-y-2"
      >
        <label 
          htmlFor="name" 
          className="block text-xs font-mono tracking-widest text-muted-foreground uppercase"
        >
          $ input.name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your full name"
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register('name')}
          className="w-full bg-card/40 border border-border focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 rounded-sm px-4 py-3 text-sm font-light tracking-wide focus:outline-none transition-all"
        />
        {errors.name && (
          <p id="name-error" className="text-xs font-mono text-rose-500 tracking-wide mt-1">
            !! error: {errors.name.message}
          </p>
        )}
      </motion.div>

      {/* Email Input Field Wrapper */}
      <motion.div 
        animate={errors.email ? "shake" : "default"}
        variants={shakeVariants}
        className="space-y-2"
      >
        <label 
          htmlFor="email" 
          className="block text-xs font-mono tracking-widest text-muted-foreground uppercase"
        >
          $ input.email
        </label>
        <input
          id="email"
          type="email"
          placeholder="hello@example.com"
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register('email')}
          className="w-full bg-card/40 border border-border focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 rounded-sm px-4 py-3 text-sm font-light tracking-wide focus:outline-none transition-all"
        />
        {errors.email && (
          <p id="email-error" className="text-xs font-mono text-rose-500 tracking-wide mt-1">
            !! error: {errors.email.message}
          </p>
        )}
      </motion.div>

      {/* Project Type Select Field Wrapper */}
      <motion.div 
        animate={errors.projectType ? "shake" : "default"}
        variants={shakeVariants}
        className="space-y-2"
      >
        <label 
          htmlFor="projectType" 
          className="block text-xs font-mono tracking-widest text-muted-foreground uppercase"
        >
          $ input.project_type
        </label>
        <div className="relative">
          <select
            id="projectType"
            aria-describedby={errors.projectType ? "project-error" : undefined}
            {...register('projectType')}
            className="w-full appearance-none bg-card/40 border border-border focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 rounded-sm px-4 py-3 text-sm font-light tracking-wide focus:outline-none transition-all cursor-pointer"
          >
            <option value="" disabled className="bg-background">Select project scope</option>
            <option value="mobile" className="bg-background text-foreground">Mobile App (React Native)</option>
            <option value="ai" className="bg-background text-foreground">AI / Intelligent App integrations</option>
            <option value="frontend" className="bg-background text-foreground">Frontend Optimization / React Website</option>
            <option value="fullstack" className="bg-background text-foreground">Full-Stack Solution (MERN)</option>
            <option value="consult" className="bg-background text-foreground">Consulting & Architecture planning</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground text-xs font-mono font-bold">
            [v]
          </div>
        </div>
        {errors.projectType && (
          <p id="project-error" className="text-xs font-mono text-rose-500 tracking-wide mt-1">
            !! error: {errors.projectType.message}
          </p>
        )}
      </motion.div>

      {/* Message Textarea Wrapper */}
      <motion.div 
        animate={errors.message ? "shake" : "default"}
        variants={shakeVariants}
        className="space-y-2"
      >
        <label 
          htmlFor="message" 
          className="block text-xs font-mono tracking-widest text-muted-foreground uppercase"
        >
          $ input.message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe your project scope, timeline, and goals..."
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register('message')}
          className="w-full bg-card/40 border border-border focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 rounded-sm px-4 py-3 text-sm font-light tracking-wide focus:outline-none transition-all resize-none"
        />
        {errors.message && (
          <p id="message-error" className="text-xs font-mono text-rose-500 tracking-wide mt-1">
            !! error: {errors.message.message}
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:bg-foreground/50 text-sm font-light tracking-widest uppercase py-3.5 px-6 rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2 font-mono text-xs">
            SENDING_TRANSMISSION...
          </span>
        ) : (
          "SUBMIT_ENQUIRY()"
        )}
      </motion.button>
    </form>
  );
}
