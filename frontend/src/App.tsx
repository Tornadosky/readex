import { Button } from "@/components/ui/button"
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import FeatureCard from "@/components/custom/landing/FeatureCard";
import PricingPlan from "@/components/custom/landing/PricingPlan";
import { RightArrowIcon, FeatureIcon } from './assets/svg';
import './App.css'

export default function App() {
  const [api, contextHolder] = notification.useNotification();
  const plans = [
    {
      id: 'starter',
      title: 'Starter',
      description: 'Best option for personal use & for your next project.',
      price: '$29',
      features: [
        { id: '1', name: 'Individual configuration'},
        { id: '2', name: 'No setup, or hidden fees' },
        { id: '3', name: 'Team size: 1 developer' },
        { id: '4', name: 'Premium support: 6 months'},
        { id: '5', name: 'Free updates: 6 months'},
      ],
    },
    {
      id: 'company',
      title: 'Company',
      description: 'Relevant for multiple users, extended & premium support.',
      price: '$99',
      features: [
        { id: '1', name: 'Individual configuration'},
        { id: '2', name: 'No setup, or hidden fees'},
        { id: '3', name: 'Team size: 10 developers'},
        { id: '4', name: 'Premium support: 24 months'},
        { id: '5', name: 'Free updates: 24 months'},
      ],
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      description: 'Best for large scale uses and extended redistribution rights.',
      price: '$499',
      features: [
        { id: '1', name: 'Individual configuration'},
        { id: '2', name: 'No setup, or hidden fees'},
        { id: '3', name: 'Team size: 100+ developers'},
        { id: '4', name: 'Premium support: 36 months'},
        { id: '5', name: 'Free updates: 36 months'},
      ],
    },
  ];

  const openNotification = () => {
    api.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  return (
    <>
      {contextHolder}
      <header className="header">
        <div className="logo">LOGO</div>
        <Button className="get-started-btn" onClick={openNotification}>Get Started</Button>
      </header>

      <div className="main-section py-60">
        <h1 className="main-title">Welcome to <span className="title-accent">Our Service</span></h1>
        <p className="main-description">Discover the endless possibilities and start your journey with us today. Let's make something great together.</p>
        <a className="chakra-button css-1ji6t5a" href="/getting-started">Get Started<span className="chakra-button__icon css-1hzyiq5"><RightArrowIcon/></span></a>
      </div>

      <section className="py-20">
        <div className="mb-32 text-center">
            <h4 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h4>
            <p className="mt-2 text-5xl lg:text-7xl font-bold tracking-tight text-gray-900">How we change the game

            </p>
        </div>
        <div className="grid md:grid-cols-3 max-w-screen-lg mx-auto gap-10 mt-16 px-5">
          <FeatureCard title='Expressive API' description="You don't need to be an expert to use our plugin. Our expressive API is
                      readable and well documented." icon={<FeatureIcon/>}/>
          <FeatureCard title='Highly performant' description="You can make sure your website or app is highly performant with a built-in
                      system to help you optimize." icon={<FeatureIcon/>}/>
          <FeatureCard title='No dependencies' description="Our plugins do not have any external dependencies so our plugin has the
                      minimal footprint possible." icon={<FeatureIcon/>}/>
          <FeatureCard title='No dependencies' description="Our plugins do not have any external dependencies so our plugin has the
                      minimal footprint possible." icon={<FeatureIcon/>}/>
          <FeatureCard title='No dependencies' description="Our plugins do not have any external dependencies so our plugin has the
                        minimal footprint possible." icon={<FeatureIcon/>}/>
          <FeatureCard title='No dependencies' description="Our plugins do not have any external dependencies so our plugin has the
                          minimal footprint possible." icon={<FeatureIcon/>}/>   
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for business teams like yours</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {plans.map((plan) => (
              <PricingPlan key={plan.id} title={plan.title} description={plan.description} price={plan.price} features={plan.features} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
