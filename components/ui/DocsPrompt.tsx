import { FileSectionReference } from '@markprompt/core';
import { Markprompt } from '@markprompt/react';
import * as Dialog from '@radix-ui/react-dialog';
import { FC, ReactNode, useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';

import { getApiUrl } from '@/lib/utils.edge';

import tailwindConfig from '../../tailwind.config';
import '@markprompt/css';
import { MarkpromptFilledIcon } from '../icons/MarkpromptFilled';

type DocsPromptProps = {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const getHref = (reference: FileSectionReference) => {
  const basePath = reference.file.path
    .replace('/pages', '')
    .replace(/\/index\.?\w*$/gi, '')
    .replace(/\.mdoc$/gi, '')
    .replace(/\.mdx$/gi, '');
  const hash = reference.meta?.leadHeading?.slug;
  if (!hash) {
    return basePath;
  } else {
    return `${basePath}#${hash}`;
  }
};

export const DocsPrompt: FC<DocsPromptProps> = ({ children, onOpenChange }) => {
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(promptOpen);
  }, [promptOpen, onOpenChange]);

  return (
    <Dialog.Root open={promptOpen} onOpenChange={setPromptOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-overlay-appear dialog-overlay" />
        <Dialog.Content
          className="animate-dialog-slide-in dialog-content flex max-h-[90%] w-[90%] max-w-[720px] flex-col overflow-hidden"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <style jsx global>
            {`
              :root {
                --markprompt-background: ${(
                  tailwindConfig.theme?.extend?.colors as any
                )?.['neutral']?.['1000']};
                --markprompt-foreground: ${colors.neutral['300']};
                --markprompt-muted: ${(
                  tailwindConfig.theme?.extend?.colors as any
                )?.['neutral']?.['1100']};
                --markprompt-mutedForeground: ${colors.neutral['500']};
                --markprompt-border: ${colors.neutral['900']};
                --markprompt-input: ${colors.neutral['100']};
                --markprompt-primary: ${colors.sky['500']};
                --markprompt-primaryForeground: ${colors.neutral['100']};
                --markprompt-primaryMuted: ${colors.sky['400']};
                --markprompt-secondary: ${(
                  tailwindConfig.theme?.extend?.colors as any
                )?.['neutral']?.['1000']};
                --markprompt-secondaryForeground: ${colors.neutral['100']};
                --markprompt-primaryHighlight: ${colors.fuchsia['500']};
                --markprompt-secondaryHighlight: ${colors.pink['500']};
                --markprompt-overlay: #00000040;
                --markprompt-ring: ${colors.neutral['100']};
                --markprompt-radius: 5px;
              }

              input {
                background-color: transparent;
              }

              .MarkpromptPrompt {
                background-color: transparent;
              }

              .MarkpromptClose {
                padding: 0.25rem;
                text-transform: uppercase;
              }

              kbd {
                font-weight: 600;
                font-size: 0.5rem;
                font-family: Inter, sans-serif;
                color: ${colors.neutral['500']};
              }
            `}
          </style>
          <div className="flex h-[calc(100vh-240px)] max-h-[560px] w-full flex-grow overflow-hidden">
            <Markprompt
              display="plain"
              showBranding={false}
              projectKey={
                (process.env.NODE_ENV === 'production'
                  ? process.env.NEXT_PUBLIC_MARKPROMPT_WEBSITE_DOCS_PROJECT_KEY
                  : process.env
                      .NEXT_PUBLIC_MARKPROMPT_WEBSITE_DOCS_PROJECT_KEY_TEST) ||
                ''
              }
              prompt={{
                apiUrl: getApiUrl('completions', false),
                model: 'gpt-4',
                placeholder: 'Ask AI…',
              }}
              references={{
                getLabel: (reference) => {
                  return (
                    reference.meta?.leadHeading?.value ||
                    reference.file?.title ||
                    'Untitled'
                  );
                },
                getHref,
              }}
              search={{
                enabled: true,
                apiUrl: getApiUrl('search', false),
                placeholder: 'Search docs…',
                getHref,
              }}
            />
          </div>
          <div className="flex flex-none flex-row items-center justify-center gap-2 border-t border-neutral-900 bg-neutral-1100 px-4 py-2 text-center text-xs text-neutral-500">
            <span>Powered by</span>
            <a
              className="inline-flex flex-row items-center gap-2 text-neutral-100"
              href="https://markprompt.com"
              target="_blank"
              rel="noreferrer"
            >
              <MarkpromptFilledIcon className="h-4 w-4" />{' '}
              <span>Markprompt AI</span>
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
