"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button"; // Adjust path as needed

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

// Re-create the Overlay with motion
const AnimatedAlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, children }, ref) => (
  // This is the correct way
  <AlertDialogPrimitive.Content asChild>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1.0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      drag
      // ✅ 2. Use Framer Motion's handler signature
      onDrag={(event, info) => {
        // 'event' is MouseEvent, TouchEvent, etc.
        // 'info' has info.point.x, info.point.y, info.offset.x, etc.
        console.log("Dragging to:", info.point.x, info.point.y);
      }}
      // Optional: Constrain dragging to the window
      dragConstraints={{
        top: -100,
        left: -400,
        right: 400,
        bottom: 200,
      }}
      className={className}
    >
      {children}
    </motion.div>
  </AlertDialogPrimitive.Content>
));
AnimatedAlertDialogOverlay.displayName = "AnimatedAlertDialogOverlay";

// Re-create the Content with motion
const AnimatedAlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AnimatedAlertDialogOverlay />
    // This is the correct way
    <AlertDialogPrimitive.Content asChild>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1.0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        // ...other props

        // ✅ 1. Enable dragging
        drag
        // ✅ 2. Use Framer Motion's handler signature
        onDrag={(event, info) => {
          // 'event' is MouseEvent, TouchEvent, etc.
          // 'info' has info.point.x, info.point.y, info.offset.x, etc.
          console.log("Dragging to:", info.point.x, info.point.y);
        }}
        // Optional: Constrain dragging to the window
        dragConstraints={{
          top: -100,
          left: -400,
          right: 400,
          bottom: 200,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
));
AnimatedAlertDialogContent.displayName = "AnimatedAlertDialogContent";

// Export the rest of the components from shadcn/ui as-is
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogTrigger,
  AnimatedAlertDialogContent, // Export our custom component
  AnimatedAlertDialogOverlay, // Export our custom component
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
