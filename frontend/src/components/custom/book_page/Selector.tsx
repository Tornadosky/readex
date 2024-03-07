import React, { Fragment } from "react";
import { Transition, Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface SelectorProps {
    options: string[];
    selected: string;
    setSelected: (value: string) => void;
    disabled: boolean;
}

const Selector: React.FC<SelectorProps> = ({ options, selected, setSelected, disabled }) => {
    
    return (
        <Listbox disabled={disabled} value={selected} onChange={setSelected}>
            <div className="relative mt-1 rounded">
            <Listbox.Button
                    className={`relative w-full cursor-default border border-slate-200 rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm ${
                        disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300'
                    }`}
                >
                    <span className="block truncate">{selected}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 border border-slate-300 ring-black/5 focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option}
                                className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                                }
                                value={option}
                            >
                                <span
                                className={`block truncate ${
                                    selected === option ? 'font-medium' : 'font-normal'
                                }`}
                                >
                                {option}
                                </span>
                                {selected === option ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                ) : null}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
export default Selector;
