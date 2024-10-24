"use client"

import * as React from "react"
import {Drawer as DrawerPrimitive} from "vaul"

import {cn} from "@/lib/utils"
import {XIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Scada} from "next/dist/compiled/@next/font/dist/google";

const Drawer = ({
                    shouldScaleBackground = true,
                    ...props
                }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        {...props}
    />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({className, ...props}, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn("fixed z-50", className)}
        {...props}
    />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & { onClose?: () => void }
>(({className, children, onClose, ...props}, ref) => (
    <DrawerPrimitive.Content
        ref={ref}
        className={cn(
            "absolute right-0 bottom-0 z-50 flex h-2/5 w-full flex-col rounded-t-[10px] bg-primary text-secondary overflow-hidden",
            className
        )}
        {...props}
    >
        <div className="absolute top-4 right-4">
            {onClose && (
                <DrawerClose>
                    <XIcon className="text-gray-400 hover:cursor-pointer" onClick={onClose}/>
                </DrawerClose>
            )}
        </div>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"/>
        <div className="overflow-y-scroll">
            {children}
        </div>

    </DrawerPrimitive.Content>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
        {...props}
    />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({className, ...props}, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({className, ...props}, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
}
