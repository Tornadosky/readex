import React, {SVGProps} from 'react';

export interface IconProps {
    className: string;
    height: string;
    width: string;
    stroke: string;
    strokeWidth: string;
    viewBox: string;
    strokeLinecap: 'round' | 'butt' | 'square' | 'inherit';
    strokeLinejoin: 'round' | 'miter' | 'bevel' | 'inherit';
}

export const iconProps: IconProps = {
    className: 'h-4 w-4',
    height: '1em',
    width: '1em',
    stroke: 'currentColor',
    strokeWidth: '2',
    viewBox: '0 0 24 24',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export const CloseSideBarIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
<svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-sm"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
>
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="2" x2="9" y2="22"></line>
</svg>
);

export const OpenSideBarIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
<svg
    stroke="black"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-sm"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
>
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="2" x2="9" y2="22"></line>
</svg>
);

export const SubmitChatIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
);

export const RightArrowIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        stroke="currentColor" 
        fill="currentColor" 
        stroke-width="0" 
        viewBox="0 0 448 512" 
        font-size="0.8em" 
        aria-hidden="true" 
        focusable="false" 
        height="1em" 
        width="1em" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
    </svg>
);

export const FeatureIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        width="15" 
        height="15" 
        viewBox="0 0 15 15" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-5 h-5"
        {...props}
    >
        <path d="M9.96424 2.68571C10.0668 2.42931 9.94209 2.13833 9.6857 2.03577C9.4293 1.93322 9.13832 2.05792 9.03576 2.31432L5.03576 12.3143C4.9332 12.5707 5.05791 12.8617 5.3143 12.9642C5.5707 13.0668 5.86168 12.9421 5.96424 12.6857L9.96424 2.68571ZM3.85355 5.14646C4.04882 5.34172 4.04882 5.6583 3.85355 5.85356L2.20711 7.50001L3.85355 9.14646C4.04882 9.34172 4.04882 9.6583 3.85355 9.85356C3.65829 10.0488 3.34171 10.0488 3.14645 9.85356L1.14645 7.85356C0.951184 7.6583 0.951184 7.34172 1.14645 7.14646L3.14645 5.14646C3.34171 4.9512 3.65829 4.9512 3.85355 5.14646ZM11.1464 5.14646C11.3417 4.9512 11.6583 4.9512 11.8536 5.14646L13.8536 7.14646C14.0488 7.34172 14.0488 7.6583 13.8536 7.85356L11.8536 9.85356C11.6583 10.0488 11.3417 10.0488 11.1464 9.85356C10.9512 9.6583 10.9512 9.34172 11.1464 9.14646L12.7929 7.50001L11.1464 5.85356C10.9512 5.6583 10.9512 5.34172 11.1464 5.14646Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
    </svg>
);

export const SuccessIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" 
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
    </svg>
);


