import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

interface DialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (!isControlled) {
      setUncontrolledOpen(value);
    }
    if (onOpenChange) {
      const newValue = typeof value === "function" ? value(open) : value;
      onOpenChange(newValue);
    }
  }, [isControlled, onOpenChange, open]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLDivElement, DialogTriggerProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, asChild = false, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    if (!context) {
      throw new Error("DialogTrigger must be used within a Dialog");
    }

    const { setOpen } = context;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setOpen(true);

      if (props.onClick) {
        props.onClick(e);
      }
    };

    const { onClick, ...otherProps } = props;

    if (asChild) {
      return (
        <div ref={ref} onClick={handleClick} {...otherProps}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, { ...(child as React.ReactElement<any>).props });
            }
            return child;
          })}
        </div>
      );
    }

    return (
      <div ref={ref} onClick={handleClick} {...otherProps}>
        {children}
      </div>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

type OmittedDialogContentHTMLAttributes = Omit<React.HTMLAttributes<HTMLDivElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' |
  'onTransitionEnd' | 'onDrag' | 'onDragEnd' | 'onDragEnter' |
  'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' |
  'onDrop' | 'onMouseDown' | 'onMouseEnter' | 'onMouseLeave' |
  'onMouseMove' | 'onMouseOut' | 'onMouseOver' | 'onMouseUp' |
  'onTouchCancel' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' |
  'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' |
  'onPointerEnter' | 'onPointerLeave' | 'onPointerOver' | 'onPointerOut' |
  'onGotPointerCapture' | 'onLostPointerCapture'
>;

const DialogContent = React.forwardRef<HTMLDivElement, OmittedDialogContentHTMLAttributes>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    if (!context) {
      throw new Error("DialogContent must be used within a Dialog");
    }

    const { open, setOpen } = context;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return ReactDOM.createPortal(
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                `relative z-[9999] w-full max-w-lg rounded-lg border 
                bg-background p-6 shadow-lg max-h-[80vh] overflow-y-auto`,
                className
              )}
              role="dialog"
              aria-modal="true"
              {...props as HTMLMotionProps<'div'>}
            >
              {children}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
  )
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
DialogDescription.displayName = "DialogDescription";

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
  )
);
DialogFooter.displayName = "DialogFooter";

const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    const setOpen = context?.setOpen;

    return (
      <button
        ref={ref}
        className={cn("cursor-pointer", className)}
        onClick={(e) => {
          if (setOpen) setOpen(false);
          if (onClick) onClick(e);
        }}
        {...props}
      />
    );
  }
);
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
};