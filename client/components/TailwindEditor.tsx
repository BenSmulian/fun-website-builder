import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TailwindEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Comprehensive Tailwind CSS classes for autocomplete
const TAILWIND_SUGGESTIONS = [
  // Layout & Display
  'container', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row', 'table-row-group',
  'block', 'inline-block', 'inline', 'hidden', 'flow-root', 'contents', 'list-item',
  
  // Flexbox
  'flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse', 'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap',
  'justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly',
  'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch',
  'content-start', 'content-end', 'content-center', 'content-between', 'content-around', 'content-evenly',
  'self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch', 'self-baseline',
  'flex-1', 'flex-auto', 'flex-initial', 'flex-none', 'grow', 'grow-0', 'shrink', 'shrink-0',
  
  // Grid
  'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8', 'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12', 'grid-cols-none',
  'col-auto', 'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-5', 'col-span-6', 'col-span-7', 'col-span-8', 'col-span-9', 'col-span-10', 'col-span-11', 'col-span-12', 'col-span-full',
  'col-start-1', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7', 'col-start-8', 'col-start-9', 'col-start-10', 'col-start-11', 'col-start-12', 'col-start-13', 'col-start-auto',
  'col-end-1', 'col-end-2', 'col-end-3', 'col-end-4', 'col-end-5', 'col-end-6', 'col-end-7', 'col-end-8', 'col-end-9', 'col-end-10', 'col-end-11', 'col-end-12', 'col-end-13', 'col-end-auto',
  'grid-rows-1', 'grid-rows-2', 'grid-rows-3', 'grid-rows-4', 'grid-rows-5', 'grid-rows-6', 'grid-rows-none',
  'row-auto', 'row-span-1', 'row-span-2', 'row-span-3', 'row-span-4', 'row-span-5', 'row-span-6', 'row-span-full',
  'row-start-1', 'row-start-2', 'row-start-3', 'row-start-4', 'row-start-5', 'row-start-6', 'row-start-7', 'row-start-auto',
  'row-end-1', 'row-end-2', 'row-end-3', 'row-end-4', 'row-end-5', 'row-end-6', 'row-end-7', 'row-end-auto',
  'gap-0', 'gap-x-0', 'gap-y-0', 'gap-px', 'gap-x-px', 'gap-y-px', 'gap-0.5', 'gap-x-0.5', 'gap-y-0.5', 'gap-1', 'gap-x-1', 'gap-y-1', 'gap-1.5', 'gap-x-1.5', 'gap-y-1.5', 'gap-2', 'gap-x-2', 'gap-y-2', 'gap-2.5', 'gap-x-2.5', 'gap-y-2.5', 'gap-3', 'gap-x-3', 'gap-y-3', 'gap-3.5', 'gap-x-3.5', 'gap-y-3.5', 'gap-4', 'gap-x-4', 'gap-y-4', 'gap-5', 'gap-x-5', 'gap-y-5', 'gap-6', 'gap-x-6', 'gap-y-6', 'gap-7', 'gap-x-7', 'gap-y-7', 'gap-8', 'gap-x-8', 'gap-y-8', 'gap-9', 'gap-x-9', 'gap-y-9', 'gap-10', 'gap-x-10', 'gap-y-10', 'gap-11', 'gap-x-11', 'gap-y-11', 'gap-12', 'gap-x-12', 'gap-y-12', 'gap-14', 'gap-x-14', 'gap-y-14', 'gap-16', 'gap-x-16', 'gap-y-16', 'gap-20', 'gap-x-20', 'gap-y-20', 'gap-24', 'gap-x-24', 'gap-y-24', 'gap-28', 'gap-x-28', 'gap-y-28', 'gap-32', 'gap-x-32', 'gap-y-32', 'gap-36', 'gap-x-36', 'gap-y-36', 'gap-40', 'gap-x-40', 'gap-y-40', 'gap-44', 'gap-x-44', 'gap-y-44', 'gap-48', 'gap-x-48', 'gap-y-48', 'gap-52', 'gap-x-52', 'gap-y-52', 'gap-56', 'gap-x-56', 'gap-y-56', 'gap-60', 'gap-x-60', 'gap-y-60', 'gap-64', 'gap-x-64', 'gap-y-64', 'gap-72', 'gap-x-72', 'gap-y-72', 'gap-80', 'gap-x-80', 'gap-y-80', 'gap-96', 'gap-x-96', 'gap-y-96',
  
  // Spacing - Padding
  'p-0', 'p-px', 'p-0.5', 'p-1', 'p-1.5', 'p-2', 'p-2.5', 'p-3', 'p-3.5', 'p-4', 'p-5', 'p-6', 'p-7', 'p-8', 'p-9', 'p-10', 'p-11', 'p-12', 'p-14', 'p-16', 'p-20', 'p-24', 'p-28', 'p-32', 'p-36', 'p-40', 'p-44', 'p-48', 'p-52', 'p-56', 'p-60', 'p-64', 'p-72', 'p-80', 'p-96',
  'px-0', 'px-px', 'px-0.5', 'px-1', 'px-1.5', 'px-2', 'px-2.5', 'px-3', 'px-3.5', 'px-4', 'px-5', 'px-6', 'px-7', 'px-8', 'px-9', 'px-10', 'px-11', 'px-12', 'px-14', 'px-16', 'px-20', 'px-24', 'px-28', 'px-32', 'px-36', 'px-40', 'px-44', 'px-48', 'px-52', 'px-56', 'px-60', 'px-64', 'px-72', 'px-80', 'px-96',
  'py-0', 'py-px', 'py-0.5', 'py-1', 'py-1.5', 'py-2', 'py-2.5', 'py-3', 'py-3.5', 'py-4', 'py-5', 'py-6', 'py-7', 'py-8', 'py-9', 'py-10', 'py-11', 'py-12', 'py-14', 'py-16', 'py-20', 'py-24', 'py-28', 'py-32', 'py-36', 'py-40', 'py-44', 'py-48', 'py-52', 'py-56', 'py-60', 'py-64', 'py-72', 'py-80', 'py-96',
  'pt-0', 'pt-px', 'pt-0.5', 'pt-1', 'pt-1.5', 'pt-2', 'pt-2.5', 'pt-3', 'pt-3.5', 'pt-4', 'pt-5', 'pt-6', 'pt-7', 'pt-8', 'pt-9', 'pt-10', 'pt-11', 'pt-12', 'pt-14', 'pt-16', 'pt-20', 'pt-24', 'pt-28', 'pt-32', 'pt-36', 'pt-40', 'pt-44', 'pt-48', 'pt-52', 'pt-56', 'pt-60', 'pt-64', 'pt-72', 'pt-80', 'pt-96',
  'pr-0', 'pr-px', 'pr-0.5', 'pr-1', 'pr-1.5', 'pr-2', 'pr-2.5', 'pr-3', 'pr-3.5', 'pr-4', 'pr-5', 'pr-6', 'pr-7', 'pr-8', 'pr-9', 'pr-10', 'pr-11', 'pr-12', 'pr-14', 'pr-16', 'pr-20', 'pr-24', 'pr-28', 'pr-32', 'pr-36', 'pr-40', 'pr-44', 'pr-48', 'pr-52', 'pr-56', 'pr-60', 'pr-64', 'pr-72', 'pr-80', 'pr-96',
  'pb-0', 'pb-px', 'pb-0.5', 'pb-1', 'pb-1.5', 'pb-2', 'pb-2.5', 'pb-3', 'pb-3.5', 'pb-4', 'pb-5', 'pb-6', 'pb-7', 'pb-8', 'pb-9', 'pb-10', 'pb-11', 'pb-12', 'pb-14', 'pb-16', 'pb-20', 'pb-24', 'pb-28', 'pb-32', 'pb-36', 'pb-40', 'pb-44', 'pb-48', 'pb-52', 'pb-56', 'pb-60', 'pb-64', 'pb-72', 'pb-80', 'pb-96',
  'pl-0', 'pl-px', 'pl-0.5', 'pl-1', 'pl-1.5', 'pl-2', 'pl-2.5', 'pl-3', 'pl-3.5', 'pl-4', 'pl-5', 'pl-6', 'pl-7', 'pl-8', 'pl-9', 'pl-10', 'pl-11', 'pl-12', 'pl-14', 'pl-16', 'pl-20', 'pl-24', 'pl-28', 'pl-32', 'pl-36', 'pl-40', 'pl-44', 'pl-48', 'pl-52', 'pl-56', 'pl-60', 'pl-64', 'pl-72', 'pl-80', 'pl-96',
  
  // Spacing - Margin
  'm-0', 'm-px', 'm-0.5', 'm-1', 'm-1.5', 'm-2', 'm-2.5', 'm-3', 'm-3.5', 'm-4', 'm-5', 'm-6', 'm-7', 'm-8', 'm-9', 'm-10', 'm-11', 'm-12', 'm-14', 'm-16', 'm-20', 'm-24', 'm-28', 'm-32', 'm-36', 'm-40', 'm-44', 'm-48', 'm-52', 'm-56', 'm-60', 'm-64', 'm-72', 'm-80', 'm-96', 'm-auto',
  'mx-0', 'mx-px', 'mx-0.5', 'mx-1', 'mx-1.5', 'mx-2', 'mx-2.5', 'mx-3', 'mx-3.5', 'mx-4', 'mx-5', 'mx-6', 'mx-7', 'mx-8', 'mx-9', 'mx-10', 'mx-11', 'mx-12', 'mx-14', 'mx-16', 'mx-20', 'mx-24', 'mx-28', 'mx-32', 'mx-36', 'mx-40', 'mx-44', 'mx-48', 'mx-52', 'mx-56', 'mx-60', 'mx-64', 'mx-72', 'mx-80', 'mx-96', 'mx-auto',
  'my-0', 'my-px', 'my-0.5', 'my-1', 'my-1.5', 'my-2', 'my-2.5', 'my-3', 'my-3.5', 'my-4', 'my-5', 'my-6', 'my-7', 'my-8', 'my-9', 'my-10', 'my-11', 'my-12', 'my-14', 'my-16', 'my-20', 'my-24', 'my-28', 'my-32', 'my-36', 'my-40', 'my-44', 'my-48', 'my-52', 'my-56', 'my-60', 'my-64', 'my-72', 'my-80', 'my-96', 'my-auto',
  'mt-0', 'mt-px', 'mt-0.5', 'mt-1', 'mt-1.5', 'mt-2', 'mt-2.5', 'mt-3', 'mt-3.5', 'mt-4', 'mt-5', 'mt-6', 'mt-7', 'mt-8', 'mt-9', 'mt-10', 'mt-11', 'mt-12', 'mt-14', 'mt-16', 'mt-20', 'mt-24', 'mt-28', 'mt-32', 'mt-36', 'mt-40', 'mt-44', 'mt-48', 'mt-52', 'mt-56', 'mt-60', 'mt-64', 'mt-72', 'mt-80', 'mt-96', 'mt-auto',
  'mr-0', 'mr-px', 'mr-0.5', 'mr-1', 'mr-1.5', 'mr-2', 'mr-2.5', 'mr-3', 'mr-3.5', 'mr-4', 'mr-5', 'mr-6', 'mr-7', 'mr-8', 'mr-9', 'mr-10', 'mr-11', 'mr-12', 'mr-14', 'mr-16', 'mr-20', 'mr-24', 'mr-28', 'mr-32', 'mr-36', 'mr-40', 'mr-44', 'mr-48', 'mr-52', 'mr-56', 'mr-60', 'mr-64', 'mr-72', 'mr-80', 'mr-96', 'mr-auto',
  'mb-0', 'mb-px', 'mb-0.5', 'mb-1', 'mb-1.5', 'mb-2', 'mb-2.5', 'mb-3', 'mb-3.5', 'mb-4', 'mb-5', 'mb-6', 'mb-7', 'mb-8', 'mb-9', 'mb-10', 'mb-11', 'mb-12', 'mb-14', 'mb-16', 'mb-20', 'mb-24', 'mb-28', 'mb-32', 'mb-36', 'mb-40', 'mb-44', 'mb-48', 'mb-52', 'mb-56', 'mb-60', 'mb-64', 'mb-72', 'mb-80', 'mb-96', 'mb-auto',
  'ml-0', 'ml-px', 'ml-0.5', 'ml-1', 'ml-1.5', 'ml-2', 'ml-2.5', 'ml-3', 'ml-3.5', 'ml-4', 'ml-5', 'ml-6', 'ml-7', 'ml-8', 'ml-9', 'ml-10', 'ml-11', 'ml-12', 'ml-14', 'ml-16', 'ml-20', 'ml-24', 'ml-28', 'ml-32', 'ml-36', 'ml-40', 'ml-44', 'ml-48', 'ml-52', 'ml-56', 'ml-60', 'ml-64', 'ml-72', 'ml-80', 'ml-96', 'ml-auto',
  
  // Width & Height
  'w-0', 'w-px', 'w-0.5', 'w-1', 'w-1.5', 'w-2', 'w-2.5', 'w-3', 'w-3.5', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 'w-9', 'w-10', 'w-11', 'w-12', 'w-14', 'w-16', 'w-20', 'w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'w-44', 'w-48', 'w-52', 'w-56', 'w-60', 'w-64', 'w-72', 'w-80', 'w-96',
  'w-auto', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-2/4', 'w-3/4', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-1/6', 'w-2/6', 'w-3/6', 'w-4/6', 'w-5/6', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12', 'w-6/12', 'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12', 'w-full', 'w-screen', 'w-min', 'w-max', 'w-fit',
  'h-0', 'h-px', 'h-0.5', 'h-1', 'h-1.5', 'h-2', 'h-2.5', 'h-3', 'h-3.5', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10', 'h-11', 'h-12', 'h-14', 'h-16', 'h-20', 'h-24', 'h-28', 'h-32', 'h-36', 'h-40', 'h-44', 'h-48', 'h-52', 'h-56', 'h-60', 'h-64', 'h-72', 'h-80', 'h-96',
  'h-auto', 'h-1/2', 'h-1/3', 'h-2/3', 'h-1/4', 'h-2/4', 'h-3/4', 'h-1/5', 'h-2/5', 'h-3/5', 'h-4/5', 'h-1/6', 'h-2/6', 'h-3/6', 'h-4/6', 'h-5/6', 'h-full', 'h-screen', 'h-min', 'h-max', 'h-fit',
  'min-w-0', 'min-w-full', 'min-w-min', 'min-w-max', 'min-w-fit', 'max-w-0', 'max-w-none', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full', 'max-w-min', 'max-w-max', 'max-w-fit', 'max-w-prose', 'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl', 'max-w-screen-2xl',
  'min-h-0', 'min-h-full', 'min-h-screen', 'min-h-min', 'min-h-max', 'min-h-fit', 'max-h-0', 'max-h-px', 'max-h-0.5', 'max-h-1', 'max-h-1.5', 'max-h-2', 'max-h-2.5', 'max-h-3', 'max-h-3.5', 'max-h-4', 'max-h-5', 'max-h-6', 'max-h-7', 'max-h-8', 'max-h-9', 'max-h-10', 'max-h-11', 'max-h-12', 'max-h-14', 'max-h-16', 'max-h-20', 'max-h-24', 'max-h-28', 'max-h-32', 'max-h-36', 'max-h-40', 'max-h-44', 'max-h-48', 'max-h-52', 'max-h-56', 'max-h-60', 'max-h-64', 'max-h-72', 'max-h-80', 'max-h-96', 'max-h-none', 'max-h-full', 'max-h-screen', 'max-h-min', 'max-h-max', 'max-h-fit',
  
  // Typography
  'font-sans', 'font-serif', 'font-mono',
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl',
  'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  'text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end',
  'leading-3', 'leading-4', 'leading-5', 'leading-6', 'leading-7', 'leading-8', 'leading-9', 'leading-10', 'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  'underline', 'overline', 'line-through', 'no-underline',
  'decoration-solid', 'decoration-double', 'decoration-dotted', 'decoration-dashed', 'decoration-wavy',
  'decoration-auto', 'decoration-from-font', 'decoration-0', 'decoration-1', 'decoration-2', 'decoration-4', 'decoration-8',
  'underline-offset-auto', 'underline-offset-0', 'underline-offset-1', 'underline-offset-2', 'underline-offset-4', 'underline-offset-8',
  'italic', 'not-italic',
  'antialiased', 'subpixel-antialiased',
  
  // Colors - Text
  'text-inherit', 'text-current', 'text-transparent', 'text-black', 'text-white',
  'text-slate-50', 'text-slate-100', 'text-slate-200', 'text-slate-300', 'text-slate-400', 'text-slate-500', 'text-slate-600', 'text-slate-700', 'text-slate-800', 'text-slate-900', 'text-slate-950',
  'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900', 'text-gray-950',
  'text-zinc-50', 'text-zinc-100', 'text-zinc-200', 'text-zinc-300', 'text-zinc-400', 'text-zinc-500', 'text-zinc-600', 'text-zinc-700', 'text-zinc-800', 'text-zinc-900', 'text-zinc-950',
  'text-neutral-50', 'text-neutral-100', 'text-neutral-200', 'text-neutral-300', 'text-neutral-400', 'text-neutral-500', 'text-neutral-600', 'text-neutral-700', 'text-neutral-800', 'text-neutral-900', 'text-neutral-950',
  'text-stone-50', 'text-stone-100', 'text-stone-200', 'text-stone-300', 'text-stone-400', 'text-stone-500', 'text-stone-600', 'text-stone-700', 'text-stone-800', 'text-stone-900', 'text-stone-950',
  'text-red-50', 'text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500', 'text-red-600', 'text-red-700', 'text-red-800', 'text-red-900', 'text-red-950',
  'text-orange-50', 'text-orange-100', 'text-orange-200', 'text-orange-300', 'text-orange-400', 'text-orange-500', 'text-orange-600', 'text-orange-700', 'text-orange-800', 'text-orange-900', 'text-orange-950',
  'text-amber-50', 'text-amber-100', 'text-amber-200', 'text-amber-300', 'text-amber-400', 'text-amber-500', 'text-amber-600', 'text-amber-700', 'text-amber-800', 'text-amber-900', 'text-amber-950',
  'text-yellow-50', 'text-yellow-100', 'text-yellow-200', 'text-yellow-300', 'text-yellow-400', 'text-yellow-500', 'text-yellow-600', 'text-yellow-700', 'text-yellow-800', 'text-yellow-900', 'text-yellow-950',
  'text-lime-50', 'text-lime-100', 'text-lime-200', 'text-lime-300', 'text-lime-400', 'text-lime-500', 'text-lime-600', 'text-lime-700', 'text-lime-800', 'text-lime-900', 'text-lime-950',
  'text-green-50', 'text-green-100', 'text-green-200', 'text-green-300', 'text-green-400', 'text-green-500', 'text-green-600', 'text-green-700', 'text-green-800', 'text-green-900', 'text-green-950',
  'text-emerald-50', 'text-emerald-100', 'text-emerald-200', 'text-emerald-300', 'text-emerald-400', 'text-emerald-500', 'text-emerald-600', 'text-emerald-700', 'text-emerald-800', 'text-emerald-900', 'text-emerald-950',
  'text-teal-50', 'text-teal-100', 'text-teal-200', 'text-teal-300', 'text-teal-400', 'text-teal-500', 'text-teal-600', 'text-teal-700', 'text-teal-800', 'text-teal-900', 'text-teal-950',
  'text-cyan-50', 'text-cyan-100', 'text-cyan-200', 'text-cyan-300', 'text-cyan-400', 'text-cyan-500', 'text-cyan-600', 'text-cyan-700', 'text-cyan-800', 'text-cyan-900', 'text-cyan-950',
  'text-sky-50', 'text-sky-100', 'text-sky-200', 'text-sky-300', 'text-sky-400', 'text-sky-500', 'text-sky-600', 'text-sky-700', 'text-sky-800', 'text-sky-900', 'text-sky-950',
  'text-blue-50', 'text-blue-100', 'text-blue-200', 'text-blue-300', 'text-blue-400', 'text-blue-500', 'text-blue-600', 'text-blue-700', 'text-blue-800', 'text-blue-900', 'text-blue-950',
  'text-indigo-50', 'text-indigo-100', 'text-indigo-200', 'text-indigo-300', 'text-indigo-400', 'text-indigo-500', 'text-indigo-600', 'text-indigo-700', 'text-indigo-800', 'text-indigo-900', 'text-indigo-950',
  'text-violet-50', 'text-violet-100', 'text-violet-200', 'text-violet-300', 'text-violet-400', 'text-violet-500', 'text-violet-600', 'text-violet-700', 'text-violet-800', 'text-violet-900', 'text-violet-950',
  'text-purple-50', 'text-purple-100', 'text-purple-200', 'text-purple-300', 'text-purple-400', 'text-purple-500', 'text-purple-600', 'text-purple-700', 'text-purple-800', 'text-purple-900', 'text-purple-950',
  'text-fuchsia-50', 'text-fuchsia-100', 'text-fuchsia-200', 'text-fuchsia-300', 'text-fuchsia-400', 'text-fuchsia-500', 'text-fuchsia-600', 'text-fuchsia-700', 'text-fuchsia-800', 'text-fuchsia-900', 'text-fuchsia-950',
  'text-pink-50', 'text-pink-100', 'text-pink-200', 'text-pink-300', 'text-pink-400', 'text-pink-500', 'text-pink-600', 'text-pink-700', 'text-pink-800', 'text-pink-900', 'text-pink-950',
  'text-rose-50', 'text-rose-100', 'text-rose-200', 'text-rose-300', 'text-rose-400', 'text-rose-500', 'text-rose-600', 'text-rose-700', 'text-rose-800', 'text-rose-900', 'text-rose-950',
  
  // Colors - Background
  'bg-inherit', 'bg-current', 'bg-transparent', 'bg-black', 'bg-white',
  'bg-slate-50', 'bg-slate-100', 'bg-slate-200', 'bg-slate-300', 'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800', 'bg-slate-900', 'bg-slate-950',
  'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900', 'bg-gray-950',
  'bg-zinc-50', 'bg-zinc-100', 'bg-zinc-200', 'bg-zinc-300', 'bg-zinc-400', 'bg-zinc-500', 'bg-zinc-600', 'bg-zinc-700', 'bg-zinc-800', 'bg-zinc-900', 'bg-zinc-950',
  'bg-neutral-50', 'bg-neutral-100', 'bg-neutral-200', 'bg-neutral-300', 'bg-neutral-400', 'bg-neutral-500', 'bg-neutral-600', 'bg-neutral-700', 'bg-neutral-800', 'bg-neutral-900', 'bg-neutral-950',
  'bg-stone-50', 'bg-stone-100', 'bg-stone-200', 'bg-stone-300', 'bg-stone-400', 'bg-stone-500', 'bg-stone-600', 'bg-stone-700', 'bg-stone-800', 'bg-stone-900', 'bg-stone-950',
  'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900', 'bg-red-950',
  'bg-orange-50', 'bg-orange-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800', 'bg-orange-900', 'bg-orange-950',
  'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900', 'bg-amber-950',
  'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900', 'bg-yellow-950',
  'bg-lime-50', 'bg-lime-100', 'bg-lime-200', 'bg-lime-300', 'bg-lime-400', 'bg-lime-500', 'bg-lime-600', 'bg-lime-700', 'bg-lime-800', 'bg-lime-900', 'bg-lime-950',
  'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900', 'bg-green-950',
  'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800', 'bg-emerald-900', 'bg-emerald-950',
  'bg-teal-50', 'bg-teal-100', 'bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700', 'bg-teal-800', 'bg-teal-900', 'bg-teal-950',
  'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-200', 'bg-cyan-300', 'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700', 'bg-cyan-800', 'bg-cyan-900', 'bg-cyan-950',
  'bg-sky-50', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-400', 'bg-sky-500', 'bg-sky-600', 'bg-sky-700', 'bg-sky-800', 'bg-sky-900', 'bg-sky-950',
  'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900', 'bg-blue-950',
  'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900', 'bg-indigo-950',
  'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800', 'bg-violet-900', 'bg-violet-950',
  'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900', 'bg-purple-950',
  'bg-fuchsia-50', 'bg-fuchsia-100', 'bg-fuchsia-200', 'bg-fuchsia-300', 'bg-fuchsia-400', 'bg-fuchsia-500', 'bg-fuchsia-600', 'bg-fuchsia-700', 'bg-fuchsia-800', 'bg-fuchsia-900', 'bg-fuchsia-950',
  'bg-pink-50', 'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700', 'bg-pink-800', 'bg-pink-900', 'bg-pink-950',
  'bg-rose-50', 'bg-rose-100', 'bg-rose-200', 'bg-rose-300', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700', 'bg-rose-800', 'bg-rose-900', 'bg-rose-950',
  
  // Borders
  'border-0', 'border-2', 'border-4', 'border-8', 'border', 'border-x-0', 'border-x-2', 'border-x-4', 'border-x-8', 'border-x', 'border-y-0', 'border-y-2', 'border-y-4', 'border-y-8', 'border-y',
  'border-t-0', 'border-t-2', 'border-t-4', 'border-t-8', 'border-t', 'border-r-0', 'border-r-2', 'border-r-4', 'border-r-8', 'border-r', 'border-b-0', 'border-b-2', 'border-b-4', 'border-b-8', 'border-b', 'border-l-0', 'border-l-2', 'border-l-4', 'border-l-8', 'border-l',
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-hidden', 'border-none',
  'border-inherit', 'border-current', 'border-transparent', 'border-black', 'border-white',
  'border-slate-50', 'border-slate-100', 'border-slate-200', 'border-slate-300', 'border-slate-400', 'border-slate-500', 'border-slate-600', 'border-slate-700', 'border-slate-800', 'border-slate-900', 'border-slate-950',
  'border-gray-50', 'border-gray-100', 'border-gray-200', 'border-gray-300', 'border-gray-400', 'border-gray-500', 'border-gray-600', 'border-gray-700', 'border-gray-800', 'border-gray-900', 'border-gray-950',
  'border-zinc-50', 'border-zinc-100', 'border-zinc-200', 'border-zinc-300', 'border-zinc-400', 'border-zinc-500', 'border-zinc-600', 'border-zinc-700', 'border-zinc-800', 'border-zinc-900', 'border-zinc-950',
  'border-neutral-50', 'border-neutral-100', 'border-neutral-200', 'border-neutral-300', 'border-neutral-400', 'border-neutral-500', 'border-neutral-600', 'border-neutral-700', 'border-neutral-800', 'border-neutral-900', 'border-neutral-950',
  'border-stone-50', 'border-stone-100', 'border-stone-200', 'border-stone-300', 'border-stone-400', 'border-stone-500', 'border-stone-600', 'border-stone-700', 'border-stone-800', 'border-stone-900', 'border-stone-950',
  'border-red-50', 'border-red-100', 'border-red-200', 'border-red-300', 'border-red-400', 'border-red-500', 'border-red-600', 'border-red-700', 'border-red-800', 'border-red-900', 'border-red-950',
  'border-orange-50', 'border-orange-100', 'border-orange-200', 'border-orange-300', 'border-orange-400', 'border-orange-500', 'border-orange-600', 'border-orange-700', 'border-orange-800', 'border-orange-900', 'border-orange-950',
  'border-amber-50', 'border-amber-100', 'border-amber-200', 'border-amber-300', 'border-amber-400', 'border-amber-500', 'border-amber-600', 'border-amber-700', 'border-amber-800', 'border-amber-900', 'border-amber-950',
  'border-yellow-50', 'border-yellow-100', 'border-yellow-200', 'border-yellow-300', 'border-yellow-400', 'border-yellow-500', 'border-yellow-600', 'border-yellow-700', 'border-yellow-800', 'border-yellow-900', 'border-yellow-950',
  'border-lime-50', 'border-lime-100', 'border-lime-200', 'border-lime-300', 'border-lime-400', 'border-lime-500', 'border-lime-600', 'border-lime-700', 'border-lime-800', 'border-lime-900', 'border-lime-950',
  'border-green-50', 'border-green-100', 'border-green-200', 'border-green-300', 'border-green-400', 'border-green-500', 'border-green-600', 'border-green-700', 'border-green-800', 'border-green-900', 'border-green-950',
  'border-emerald-50', 'border-emerald-100', 'border-emerald-200', 'border-emerald-300', 'border-emerald-400', 'border-emerald-500', 'border-emerald-600', 'border-emerald-700', 'border-emerald-800', 'border-emerald-900', 'border-emerald-950',
  'border-teal-50', 'border-teal-100', 'border-teal-200', 'border-teal-300', 'border-teal-400', 'border-teal-500', 'border-teal-600', 'border-teal-700', 'border-teal-800', 'border-teal-900', 'border-teal-950',
  'border-cyan-50', 'border-cyan-100', 'border-cyan-200', 'border-cyan-300', 'border-cyan-400', 'border-cyan-500', 'border-cyan-600', 'border-cyan-700', 'border-cyan-800', 'border-cyan-900', 'border-cyan-950',
  'border-sky-50', 'border-sky-100', 'border-sky-200', 'border-sky-300', 'border-sky-400', 'border-sky-500', 'border-sky-600', 'border-sky-700', 'border-sky-800', 'border-sky-900', 'border-sky-950',
  'border-blue-50', 'border-blue-100', 'border-blue-200', 'border-blue-300', 'border-blue-400', 'border-blue-500', 'border-blue-600', 'border-blue-700', 'border-blue-800', 'border-blue-900', 'border-blue-950',
  'border-indigo-50', 'border-indigo-100', 'border-indigo-200', 'border-indigo-300', 'border-indigo-400', 'border-indigo-500', 'border-indigo-600', 'border-indigo-700', 'border-indigo-800', 'border-indigo-900', 'border-indigo-950',
  'border-violet-50', 'border-violet-100', 'border-violet-200', 'border-violet-300', 'border-violet-400', 'border-violet-500', 'border-violet-600', 'border-violet-700', 'border-violet-800', 'border-violet-900', 'border-violet-950',
  'border-purple-50', 'border-purple-100', 'border-purple-200', 'border-purple-300', 'border-purple-400', 'border-purple-500', 'border-purple-600', 'border-purple-700', 'border-purple-800', 'border-purple-900', 'border-purple-950',
  'border-fuchsia-50', 'border-fuchsia-100', 'border-fuchsia-200', 'border-fuchsia-300', 'border-fuchsia-400', 'border-fuchsia-500', 'border-fuchsia-600', 'border-fuchsia-700', 'border-fuchsia-800', 'border-fuchsia-900', 'border-fuchsia-950',
  'border-pink-50', 'border-pink-100', 'border-pink-200', 'border-pink-300', 'border-pink-400', 'border-pink-500', 'border-pink-600', 'border-pink-700', 'border-pink-800', 'border-pink-900', 'border-pink-950',
  'border-rose-50', 'border-rose-100', 'border-rose-200', 'border-rose-300', 'border-rose-400', 'border-rose-500', 'border-rose-600', 'border-rose-700', 'border-rose-800', 'border-rose-900', 'border-rose-950',
  'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  'rounded-t-none', 'rounded-t-sm', 'rounded-t', 'rounded-t-md', 'rounded-t-lg', 'rounded-t-xl', 'rounded-t-2xl', 'rounded-t-3xl', 'rounded-t-full',
  'rounded-r-none', 'rounded-r-sm', 'rounded-r', 'rounded-r-md', 'rounded-r-lg', 'rounded-r-xl', 'rounded-r-2xl', 'rounded-r-3xl', 'rounded-r-full',
  'rounded-b-none', 'rounded-b-sm', 'rounded-b', 'rounded-b-md', 'rounded-b-lg', 'rounded-b-xl', 'rounded-b-2xl', 'rounded-b-3xl', 'rounded-b-full',
  'rounded-l-none', 'rounded-l-sm', 'rounded-l', 'rounded-l-md', 'rounded-l-lg', 'rounded-l-xl', 'rounded-l-2xl', 'rounded-l-3xl', 'rounded-l-full',
  'rounded-tl-none', 'rounded-tl-sm', 'rounded-tl', 'rounded-tl-md', 'rounded-tl-lg', 'rounded-tl-xl', 'rounded-tl-2xl', 'rounded-tl-3xl', 'rounded-tl-full',
  'rounded-tr-none', 'rounded-tr-sm', 'rounded-tr', 'rounded-tr-md', 'rounded-tr-lg', 'rounded-tr-xl', 'rounded-tr-2xl', 'rounded-tr-3xl', 'rounded-tr-full',
  'rounded-br-none', 'rounded-br-sm', 'rounded-br', 'rounded-br-md', 'rounded-br-lg', 'rounded-br-xl', 'rounded-br-2xl', 'rounded-br-3xl', 'rounded-br-full',
  'rounded-bl-none', 'rounded-bl-sm', 'rounded-bl', 'rounded-bl-md', 'rounded-bl-lg', 'rounded-bl-xl', 'rounded-bl-2xl', 'rounded-bl-3xl', 'rounded-bl-full',
  
  // Effects
  'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
  'drop-shadow-sm', 'drop-shadow', 'drop-shadow-md', 'drop-shadow-lg', 'drop-shadow-xl', 'drop-shadow-2xl', 'drop-shadow-none',
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100',
  'blur-none', 'blur-sm', 'blur', 'blur-md', 'blur-lg', 'blur-xl', 'blur-2xl', 'blur-3xl',
  'brightness-0', 'brightness-50', 'brightness-75', 'brightness-90', 'brightness-95', 'brightness-100', 'brightness-105', 'brightness-110', 'brightness-125', 'brightness-150', 'brightness-200',
  'contrast-0', 'contrast-50', 'contrast-75', 'contrast-100', 'contrast-125', 'contrast-150', 'contrast-200',
  'grayscale-0', 'grayscale',
  'hue-rotate-0', 'hue-rotate-15', 'hue-rotate-30', 'hue-rotate-60', 'hue-rotate-90', 'hue-rotate-180',
  'invert-0', 'invert',
  'saturate-0', 'saturate-50', 'saturate-100', 'saturate-150', 'saturate-200',
  'sepia-0', 'sepia',
  
  // Position
  'static', 'fixed', 'absolute', 'relative', 'sticky',
  'inset-0', 'inset-x-0', 'inset-y-0', 'inset-px', 'inset-x-px', 'inset-y-px', 'inset-0.5', 'inset-x-0.5', 'inset-y-0.5', 'inset-1', 'inset-x-1', 'inset-y-1', 'inset-1.5', 'inset-x-1.5', 'inset-y-1.5', 'inset-2', 'inset-x-2', 'inset-y-2', 'inset-2.5', 'inset-x-2.5', 'inset-y-2.5', 'inset-3', 'inset-x-3', 'inset-y-3', 'inset-3.5', 'inset-x-3.5', 'inset-y-3.5', 'inset-4', 'inset-x-4', 'inset-y-4', 'inset-5', 'inset-x-5', 'inset-y-5', 'inset-6', 'inset-x-6', 'inset-y-6', 'inset-7', 'inset-x-7', 'inset-y-7', 'inset-8', 'inset-x-8', 'inset-y-8', 'inset-9', 'inset-x-9', 'inset-y-9', 'inset-10', 'inset-x-10', 'inset-y-10', 'inset-11', 'inset-x-11', 'inset-y-11', 'inset-12', 'inset-x-12', 'inset-y-12', 'inset-14', 'inset-x-14', 'inset-y-14', 'inset-16', 'inset-x-16', 'inset-y-16', 'inset-20', 'inset-x-20', 'inset-y-20', 'inset-24', 'inset-x-24', 'inset-y-24', 'inset-28', 'inset-x-28', 'inset-y-28', 'inset-32', 'inset-x-32', 'inset-y-32', 'inset-36', 'inset-x-36', 'inset-y-36', 'inset-40', 'inset-x-40', 'inset-y-40', 'inset-44', 'inset-x-44', 'inset-y-44', 'inset-48', 'inset-x-48', 'inset-y-48', 'inset-52', 'inset-x-52', 'inset-y-52', 'inset-56', 'inset-x-56', 'inset-y-56', 'inset-60', 'inset-x-60', 'inset-y-60', 'inset-64', 'inset-x-64', 'inset-y-64', 'inset-72', 'inset-x-72', 'inset-y-72', 'inset-80', 'inset-x-80', 'inset-y-80', 'inset-96', 'inset-x-96', 'inset-y-96', 'inset-auto', 'inset-x-auto', 'inset-y-auto', 'inset-1/2', 'inset-x-1/2', 'inset-y-1/2', 'inset-1/3', 'inset-x-1/3', 'inset-y-1/3', 'inset-2/3', 'inset-x-2/3', 'inset-y-2/3', 'inset-1/4', 'inset-x-1/4', 'inset-y-1/4', 'inset-2/4', 'inset-x-2/4', 'inset-y-2/4', 'inset-3/4', 'inset-x-3/4', 'inset-y-3/4', 'inset-full', 'inset-x-full', 'inset-y-full',
  'top-0', 'top-px', 'top-0.5', 'top-1', 'top-1.5', 'top-2', 'top-2.5', 'top-3', 'top-3.5', 'top-4', 'top-5', 'top-6', 'top-7', 'top-8', 'top-9', 'top-10', 'top-11', 'top-12', 'top-14', 'top-16', 'top-20', 'top-24', 'top-28', 'top-32', 'top-36', 'top-40', 'top-44', 'top-48', 'top-52', 'top-56', 'top-60', 'top-64', 'top-72', 'top-80', 'top-96', 'top-auto', 'top-1/2', 'top-1/3', 'top-2/3', 'top-1/4', 'top-2/4', 'top-3/4', 'top-full',
  'right-0', 'right-px', 'right-0.5', 'right-1', 'right-1.5', 'right-2', 'right-2.5', 'right-3', 'right-3.5', 'right-4', 'right-5', 'right-6', 'right-7', 'right-8', 'right-9', 'right-10', 'right-11', 'right-12', 'right-14', 'right-16', 'right-20', 'right-24', 'right-28', 'right-32', 'right-36', 'right-40', 'right-44', 'right-48', 'right-52', 'right-56', 'right-60', 'right-64', 'right-72', 'right-80', 'right-96', 'right-auto', 'right-1/2', 'right-1/3', 'right-2/3', 'right-1/4', 'right-2/4', 'right-3/4', 'right-full',
  'bottom-0', 'bottom-px', 'bottom-0.5', 'bottom-1', 'bottom-1.5', 'bottom-2', 'bottom-2.5', 'bottom-3', 'bottom-3.5', 'bottom-4', 'bottom-5', 'bottom-6', 'bottom-7', 'bottom-8', 'bottom-9', 'bottom-10', 'bottom-11', 'bottom-12', 'bottom-14', 'bottom-16', 'bottom-20', 'bottom-24', 'bottom-28', 'bottom-32', 'bottom-36', 'bottom-40', 'bottom-44', 'bottom-48', 'bottom-52', 'bottom-56', 'bottom-60', 'bottom-64', 'bottom-72', 'bottom-80', 'bottom-96', 'bottom-auto', 'bottom-1/2', 'bottom-1/3', 'bottom-2/3', 'bottom-1/4', 'bottom-2/4', 'bottom-3/4', 'bottom-full',
  'left-0', 'left-px', 'left-0.5', 'left-1', 'left-1.5', 'left-2', 'left-2.5', 'left-3', 'left-3.5', 'left-4', 'left-5', 'left-6', 'left-7', 'left-8', 'left-9', 'left-10', 'left-11', 'left-12', 'left-14', 'left-16', 'left-20', 'left-24', 'left-28', 'left-32', 'left-36', 'left-40', 'left-44', 'left-48', 'left-52', 'left-56', 'left-60', 'left-64', 'left-72', 'left-80', 'left-96', 'left-auto', 'left-1/2', 'left-1/3', 'left-2/3', 'left-1/4', 'left-2/4', 'left-3/4', 'left-full',
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',
  
  // Interactivity
  'cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text', 'cursor-move', 'cursor-help', 'cursor-not-allowed', 'cursor-none', 'cursor-context-menu', 'cursor-progress', 'cursor-cell', 'cursor-crosshair', 'cursor-vertical-text', 'cursor-alias', 'cursor-copy', 'cursor-no-drop', 'cursor-grab', 'cursor-grabbing', 'cursor-all-scroll', 'cursor-col-resize', 'cursor-row-resize', 'cursor-n-resize', 'cursor-e-resize', 'cursor-s-resize', 'cursor-w-resize', 'cursor-ne-resize', 'cursor-nw-resize', 'cursor-se-resize', 'cursor-sw-resize', 'cursor-ew-resize', 'cursor-ns-resize', 'cursor-nesw-resize', 'cursor-nwse-resize', 'cursor-zoom-in', 'cursor-zoom-out',
  'pointer-events-none', 'pointer-events-auto',
  'resize-none', 'resize-y', 'resize-x', 'resize',
  'select-none', 'select-text', 'select-all', 'select-auto',
  
  // Overflow
  'overflow-auto', 'overflow-hidden', 'overflow-clip', 'overflow-visible', 'overflow-scroll',
  'overflow-x-auto', 'overflow-x-hidden', 'overflow-x-clip', 'overflow-x-visible', 'overflow-x-scroll',
  'overflow-y-auto', 'overflow-y-hidden', 'overflow-y-clip', 'overflow-y-visible', 'overflow-y-scroll',
  'overscroll-auto', 'overscroll-contain', 'overscroll-none',
  'overscroll-x-auto', 'overscroll-x-contain', 'overscroll-x-none',
  'overscroll-y-auto', 'overscroll-y-contain', 'overscroll-y-none',
  
  // Hover, Focus, etc.
  'hover:opacity-0', 'hover:opacity-5', 'hover:opacity-10', 'hover:opacity-20', 'hover:opacity-25', 'hover:opacity-30', 'hover:opacity-40', 'hover:opacity-50', 'hover:opacity-60', 'hover:opacity-70', 'hover:opacity-75', 'hover:opacity-80', 'hover:opacity-90', 'hover:opacity-95', 'hover:opacity-100',
  'hover:bg-slate-50', 'hover:bg-slate-100', 'hover:bg-slate-200', 'hover:bg-slate-300', 'hover:bg-slate-400', 'hover:bg-slate-500', 'hover:bg-slate-600', 'hover:bg-slate-700', 'hover:bg-slate-800', 'hover:bg-slate-900', 'hover:bg-slate-950',
  'hover:bg-gray-50', 'hover:bg-gray-100', 'hover:bg-gray-200', 'hover:bg-gray-300', 'hover:bg-gray-400', 'hover:bg-gray-500', 'hover:bg-gray-600', 'hover:bg-gray-700', 'hover:bg-gray-800', 'hover:bg-gray-900', 'hover:bg-gray-950',
  'hover:text-slate-50', 'hover:text-slate-100', 'hover:text-slate-200', 'hover:text-slate-300', 'hover:text-slate-400', 'hover:text-slate-500', 'hover:text-slate-600', 'hover:text-slate-700', 'hover:text-slate-800', 'hover:text-slate-900', 'hover:text-slate-950',
  'hover:text-gray-50', 'hover:text-gray-100', 'hover:text-gray-200', 'hover:text-gray-300', 'hover:text-gray-400', 'hover:text-gray-500', 'hover:text-gray-600', 'hover:text-gray-700', 'hover:text-gray-800', 'hover:text-gray-900', 'hover:text-gray-950',
  'hover:shadow-sm', 'hover:shadow', 'hover:shadow-md', 'hover:shadow-lg', 'hover:shadow-xl', 'hover:shadow-2xl', 'hover:shadow-none',
  'focus:opacity-0', 'focus:opacity-5', 'focus:opacity-10', 'focus:opacity-20', 'focus:opacity-25', 'focus:opacity-30', 'focus:opacity-40', 'focus:opacity-50', 'focus:opacity-60', 'focus:opacity-70', 'focus:opacity-75', 'focus:opacity-80', 'focus:opacity-90', 'focus:opacity-95', 'focus:opacity-100',
  'focus:outline-none', 'focus:outline-0', 'focus:outline-1', 'focus:outline-2', 'focus:outline-4', 'focus:outline-8',
  'focus:ring-0', 'focus:ring-1', 'focus:ring-2', 'focus:ring-4', 'focus:ring-8', 'focus:ring', 'focus:ring-inset',
  'active:opacity-0', 'active:opacity-5', 'active:opacity-10', 'active:opacity-20', 'active:opacity-25', 'active:opacity-30', 'active:opacity-40', 'active:opacity-50', 'active:opacity-60', 'active:opacity-70', 'active:opacity-75', 'active:opacity-80', 'active:opacity-90', 'active:opacity-95', 'active:opacity-100',
  
  // Responsive Breakpoints
  'sm:container', 'md:container', 'lg:container', 'xl:container', '2xl:container',
  'sm:block', 'sm:inline-block', 'sm:inline', 'sm:flex', 'sm:inline-flex', 'sm:table', 'sm:inline-table', 'sm:table-caption', 'sm:table-cell', 'sm:table-column', 'sm:table-column-group', 'sm:table-footer-group', 'sm:table-header-group', 'sm:table-row-group', 'sm:table-row', 'sm:flow-root', 'sm:grid', 'sm:inline-grid', 'sm:contents', 'sm:list-item', 'sm:hidden',
  'md:block', 'md:inline-block', 'md:inline', 'md:flex', 'md:inline-flex', 'md:table', 'md:inline-table', 'md:table-caption', 'md:table-cell', 'md:table-column', 'md:table-column-group', 'md:table-footer-group', 'md:table-header-group', 'md:table-row-group', 'md:table-row', 'md:flow-root', 'md:grid', 'md:inline-grid', 'md:contents', 'md:list-item', 'md:hidden',
  'lg:block', 'lg:inline-block', 'lg:inline', 'lg:flex', 'lg:inline-flex', 'lg:table', 'lg:inline-table', 'lg:table-caption', 'lg:table-cell', 'lg:table-column', 'lg:table-column-group', 'lg:table-footer-group', 'lg:table-header-group', 'lg:table-row-group', 'lg:table-row', 'lg:flow-root', 'lg:grid', 'lg:inline-grid', 'lg:contents', 'lg:list-item', 'lg:hidden',
  'xl:block', 'xl:inline-block', 'xl:inline', 'xl:flex', 'xl:inline-flex', 'xl:table', 'xl:inline-table', 'xl:table-caption', 'xl:table-cell', 'xl:table-column', 'xl:table-column-group', 'xl:table-footer-group', 'xl:table-header-group', 'xl:table-row-group', 'xl:table-row', 'xl:flow-root', 'xl:grid', 'xl:inline-grid', 'xl:contents', 'xl:list-item', 'xl:hidden',
  '2xl:block', '2xl:inline-block', '2xl:inline', '2xl:flex', '2xl:inline-flex', '2xl:table', '2xl:inline-table', '2xl:table-caption', '2xl:table-cell', '2xl:table-column', '2xl:table-column-group', '2xl:table-footer-group', '2xl:table-header-group', '2xl:table-row-group', '2xl:table-row', '2xl:flow-root', '2xl:grid', '2xl:inline-grid', '2xl:contents', '2xl:list-item', '2xl:hidden',
  'sm:p-0', 'sm:p-1', 'sm:p-2', 'sm:p-3', 'sm:p-4', 'sm:p-5', 'sm:p-6', 'sm:p-7', 'sm:p-8', 'sm:p-9', 'sm:p-10', 'sm:p-11', 'sm:p-12', 'sm:p-14', 'sm:p-16', 'sm:p-20', 'sm:p-24', 'sm:p-28', 'sm:p-32', 'sm:p-36', 'sm:p-40', 'sm:p-44', 'sm:p-48', 'sm:p-52', 'sm:p-56', 'sm:p-60', 'sm:p-64', 'sm:p-72', 'sm:p-80', 'sm:p-96',
  'md:p-0', 'md:p-1', 'md:p-2', 'md:p-3', 'md:p-4', 'md:p-5', 'md:p-6', 'md:p-7', 'md:p-8', 'md:p-9', 'md:p-10', 'md:p-11', 'md:p-12', 'md:p-14', 'md:p-16', 'md:p-20', 'md:p-24', 'md:p-28', 'md:p-32', 'md:p-36', 'md:p-40', 'md:p-44', 'md:p-48', 'md:p-52', 'md:p-56', 'md:p-60', 'md:p-64', 'md:p-72', 'md:p-80', 'md:p-96',
  'lg:p-0', 'lg:p-1', 'lg:p-2', 'lg:p-3', 'lg:p-4', 'lg:p-5', 'lg:p-6', 'lg:p-7', 'lg:p-8', 'lg:p-9', 'lg:p-10', 'lg:p-11', 'lg:p-12', 'lg:p-14', 'lg:p-16', 'lg:p-20', 'lg:p-24', 'lg:p-28', 'lg:p-32', 'lg:p-36', 'lg:p-40', 'lg:p-44', 'lg:p-48', 'lg:p-52', 'lg:p-56', 'lg:p-60', 'lg:p-64', 'lg:p-72', 'lg:p-80', 'lg:p-96',
  'xl:p-0', 'xl:p-1', 'xl:p-2', 'xl:p-3', 'xl:p-4', 'xl:p-5', 'xl:p-6', 'xl:p-7', 'xl:p-8', 'xl:p-9', 'xl:p-10', 'xl:p-11', 'xl:p-12', 'xl:p-14', 'xl:p-16', 'xl:p-20', 'xl:p-24', 'xl:p-28', 'xl:p-32', 'xl:p-36', 'xl:p-40', 'xl:p-44', 'xl:p-48', 'xl:p-52', 'xl:p-56', 'xl:p-60', 'xl:p-64', 'xl:p-72', 'xl:p-80', 'xl:p-96',
  '2xl:p-0', '2xl:p-1', '2xl:p-2', '2xl:p-3', '2xl:p-4', '2xl:p-5', '2xl:p-6', '2xl:p-7', '2xl:p-8', '2xl:p-9', '2xl:p-10', '2xl:p-11', '2xl:p-12', '2xl:p-14', '2xl:p-16', '2xl:p-20', '2xl:p-24', '2xl:p-28', '2xl:p-32', '2xl:p-36', '2xl:p-40', '2xl:p-44', '2xl:p-48', '2xl:p-52', '2xl:p-56', '2xl:p-60', '2xl:p-64', '2xl:p-72', '2xl:p-80', '2xl:p-96',
  'sm:text-xs', 'sm:text-sm', 'sm:text-base', 'sm:text-lg', 'sm:text-xl', 'sm:text-2xl', 'sm:text-3xl', 'sm:text-4xl', 'sm:text-5xl', 'sm:text-6xl', 'sm:text-7xl', 'sm:text-8xl', 'sm:text-9xl',
  'md:text-xs', 'md:text-sm', 'md:text-base', 'md:text-lg', 'md:text-xl', 'md:text-2xl', 'md:text-3xl', 'md:text-4xl', 'md:text-5xl', 'md:text-6xl', 'md:text-7xl', 'md:text-8xl', 'md:text-9xl',
  'lg:text-xs', 'lg:text-sm', 'lg:text-base', 'lg:text-lg', 'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl', 'lg:text-4xl', 'lg:text-5xl', 'lg:text-6xl', 'lg:text-7xl', 'lg:text-8xl', 'lg:text-9xl',
  'xl:text-xs', 'xl:text-sm', 'xl:text-base', 'xl:text-lg', 'xl:text-xl', 'xl:text-2xl', 'xl:text-3xl', 'xl:text-4xl', 'xl:text-5xl', 'xl:text-6xl', 'xl:text-7xl', 'xl:text-8xl', 'xl:text-9xl',
  '2xl:text-xs', '2xl:text-sm', '2xl:text-base', '2xl:text-lg', '2xl:text-xl', '2xl:text-2xl', '2xl:text-3xl', '2xl:text-4xl', '2xl:text-5xl', '2xl:text-6xl', '2xl:text-7xl', '2xl:text-8xl', '2xl:text-9xl',
  
  // Transform
  'scale-0', 'scale-x-0', 'scale-y-0', 'scale-50', 'scale-x-50', 'scale-y-50', 'scale-75', 'scale-x-75', 'scale-y-75', 'scale-90', 'scale-x-90', 'scale-y-90', 'scale-95', 'scale-x-95', 'scale-y-95', 'scale-100', 'scale-x-100', 'scale-y-100', 'scale-105', 'scale-x-105', 'scale-y-105', 'scale-110', 'scale-x-110', 'scale-y-110', 'scale-125', 'scale-x-125', 'scale-y-125', 'scale-150', 'scale-x-150', 'scale-y-150',
  'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-6', 'rotate-12', 'rotate-45', 'rotate-90', 'rotate-180',
  'skew-x-0', 'skew-x-1', 'skew-x-2', 'skew-x-3', 'skew-x-6', 'skew-x-12', 'skew-y-0', 'skew-y-1', 'skew-y-2', 'skew-y-3', 'skew-y-6', 'skew-y-12',
  'translate-x-0', 'translate-x-px', 'translate-x-0.5', 'translate-x-1', 'translate-x-1.5', 'translate-x-2', 'translate-x-2.5', 'translate-x-3', 'translate-x-3.5', 'translate-x-4', 'translate-x-5', 'translate-x-6', 'translate-x-7', 'translate-x-8', 'translate-x-9', 'translate-x-10', 'translate-x-11', 'translate-x-12', 'translate-x-14', 'translate-x-16', 'translate-x-20', 'translate-x-24', 'translate-x-28', 'translate-x-32', 'translate-x-36', 'translate-x-40', 'translate-x-44', 'translate-x-48', 'translate-x-52', 'translate-x-56', 'translate-x-60', 'translate-x-64', 'translate-x-72', 'translate-x-80', 'translate-x-96', 'translate-x-1/2', 'translate-x-1/3', 'translate-x-2/3', 'translate-x-1/4', 'translate-x-2/4', 'translate-x-3/4', 'translate-x-full',
  'translate-y-0', 'translate-y-px', 'translate-y-0.5', 'translate-y-1', 'translate-y-1.5', 'translate-y-2', 'translate-y-2.5', 'translate-y-3', 'translate-y-3.5', 'translate-y-4', 'translate-y-5', 'translate-y-6', 'translate-y-7', 'translate-y-8', 'translate-y-9', 'translate-y-10', 'translate-y-11', 'translate-y-12', 'translate-y-14', 'translate-y-16', 'translate-y-20', 'translate-y-24', 'translate-y-28', 'translate-y-32', 'translate-y-36', 'translate-y-40', 'translate-y-44', 'translate-y-48', 'translate-y-52', 'translate-y-56', 'translate-y-60', 'translate-y-64', 'translate-y-72', 'translate-y-80', 'translate-y-96', 'translate-y-1/2', 'translate-y-1/3', 'translate-y-2/3', 'translate-y-1/4', 'translate-y-2/4', 'translate-y-3/4', 'translate-y-full',
  
  // Transitions
  'transition-none', 'transition-all', 'transition', 'transition-colors', 'transition-opacity', 'transition-shadow', 'transition-transform',
  'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
  'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500', 'delay-700', 'delay-1000',
  
  // Animation
  'animate-none', 'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce',
];

export function TailwindEditor({ value, onChange, placeholder, className }: TailwindEditorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get current word being typed
  const getCurrentWord = useCallback((text: string, cursorPos: number): { word: string; start: number } => {
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);
    
    const wordStart = beforeCursor.split(' ').pop() || '';
    const wordEnd = afterCursor.split(' ')[0] || '';
    
    return {
      word: wordStart + wordEnd,
      start: cursorPos - wordStart.length
    };
  }, []);

  // Filter suggestions based on current word
  const filterSuggestions = useCallback((word: string) => {
    if (!word || word.length < 2) return [];
    
    return TAILWIND_SUGGESTIONS
      .filter(suggestion => suggestion.toLowerCase().startsWith(word.toLowerCase()))
      .slice(0, 10);
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const { word } = getCurrentWord(newValue, cursorPos);
    
    if (word && word.length >= 2) {
      const filtered = filterSuggestions(word);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [onChange, getCurrentWord, filterSuggestions]);

  // Handle key down events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case 'Tab':
        if (suggestions[selectedSuggestion]) {
          e.preventDefault();
          insertSuggestion(suggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestion]);

  // Insert selected suggestion
  const insertSuggestion = useCallback((suggestion: string) => {
    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const { word, start } = getCurrentWord(value, cursorPos);
    
    const newValue = value.slice(0, start) + suggestion + value.slice(start + word.length);
    onChange(newValue);
    setShowSuggestions(false);

    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + suggestion.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [value, onChange, getCurrentWord]);

  // Highlight Tailwind classes in the text
  const highlightedValue = value.split(' ').map((word, index) => {
    const isTailwindClass = TAILWIND_SUGGESTIONS.includes(word);
    return (
      <span
        key={index}
        className={isTailwindClass ? 'text-blue-600 font-medium' : 'text-gray-900'}
      >
        {word}{index < value.split(' ').length - 1 ? ' ' : ''}
      </span>
    );
  });

  return (
    <div className={`relative ${className}`}>
      {/* Highlighted background layer */}
      <div className="absolute inset-0 p-3 text-sm font-mono whitespace-pre-wrap break-words pointer-events-none overflow-hidden border border-transparent rounded-md bg-transparent">
        <div className="opacity-0">
          {highlightedValue}
        </div>
      </div>

      {/* Actual textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`relative z-10 font-mono text-sm bg-transparent resize-none ${className}`}
        style={{ color: 'transparent', caretColor: '#1f2937' }}
      />

      {/* Text overlay for highlighting */}
      <div className="absolute inset-0 p-3 text-sm font-mono whitespace-pre-wrap break-words pointer-events-none overflow-hidden border border-transparent rounded-md">
        {highlightedValue}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-3 py-2 cursor-pointer text-sm font-mono ${
                index === selectedSuggestion ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
              }`}
              onClick={() => insertSuggestion(suggestion)}
            >
              <span className="text-blue-600">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
