import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { UserPreferences } from '../../types/source';
import PreferencesPanel from './PreferencesPanel';

export interface PreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdate: (partial: Partial<UserPreferences>) => void;
  onReset: () => void;
}

const PreferencesDrawer = ({
  isOpen,
  onClose,
  preferences,
  onUpdate,
  onReset,
}: PreferencesDrawerProps) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] dark:bg-slate-950/55" aria-hidden="true" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="flex h-full w-full flex-col border-l border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 sm:w-96">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
                <Dialog.Title className="flex items-center text-xl font-semibold leading-none tracking-[-0.03em] text-slate-900 dark:text-slate-100">
                  Preferences
                </Dialog.Title>

                <button
                  type="button"
                  aria-label="Close preferences"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-900"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                <PreferencesPanel
                  preferences={preferences}
                  onUpdate={onUpdate}
                  onReset={onReset}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default PreferencesDrawer;
