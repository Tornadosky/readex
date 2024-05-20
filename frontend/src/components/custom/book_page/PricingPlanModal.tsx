import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseOutlined } from '@ant-design/icons';
import { Progress } from 'antd';

const pricingPlans = [
  { id: 1, name: 'Basic', price: '$10/month', features: '10 PDF uploads per month' },
  { id: 2, name: 'Standard', price: '$20/month', features: '20 PDF uploads per month' },
  { id: 3, name: 'Premium', price: '$30/month', features: 'Unlimited PDF uploads' }
];

const userLimits = {
  pdfUploads: { used: 7, total: 10 },
  credits: { used: 12, total: 50 }
};

interface PricingPlanModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (plan: any) => void;
}

const PricingPlanModal: React.FC<PricingPlanModalProps> = ({ isOpen, setIsOpen, onSubmit }) => {

  const handleSubmit = () => {
    console.log('Submitting plan:');
    onSubmit("Pro");
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className='absolute top-2 right-4'>
                  <CloseOutlined onClick={() => setIsOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Select a Pricing Plan</h3>
                
                <div className="mt-2">
                  <div>PDF Uploads: {userLimits.pdfUploads.used}/{userLimits.pdfUploads.total}</div>
                  <Progress percent={(userLimits.pdfUploads.used / userLimits.pdfUploads.total) * 100} />
                  <div>Credits Used: {userLimits.credits.used}/{userLimits.credits.total}</div>
                  <Progress percent={(userLimits.credits.used / userLimits.credits.total) * 100} />
                </div>
                
                <div className="mt-4 flex items-start justify-between">
                    <div>
                        <div className="text-xl font-medium">Pro</div>
                        <div className="text-gray-400 text-sm font-medium">Make your learning 1000x easier!</div>
                        <ul className="mt-2 list-disc pl-5 text-gray-700">
                            {pricingPlans.map(plan => (
                                <li key={plan.id}>{plan.features}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col items-end">
                        <div>
                            <span className="text-4xl font-bold tracking-tight text-gray-900">$10</span>
                            <span className="text-base font-medium text-gray-500">/month</span>
                        </div>
                        <div className="text-gray-400 ml-6 mt-[1px]">Billed monthly</div>
                    </div>
                </div>

                <div className="mt-4 flex justify-center items-center">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSubmit}
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PricingPlanModal;
