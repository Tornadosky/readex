import { UpOutlined, DownOutlined } from '@ant-design/icons';

interface TopbarProps {
    name: string;
    inputPage: string;
    pageCount: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
    handlePageInput: (e: any) => void;
    submitPageInput: (e: any) => void;
}

const Topbar = ({
    name, 
    inputPage, 
    pageCount, 
    handleDecrease, 
    handleIncrease, 
    handlePageInput, 
    submitPageInput 
} : TopbarProps) => {
    return (
        <div
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            padding: "10px 20px",
            border: "1px solid #ddd",
            height: "57px",
            }}
        >
            <h1 style={{ margin: 0 }}>{name}</h1>
            <div
            style={{
                display: "flex",
                gap: "10px",
            }}
            >
            <button 
                type="button" 
                className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                onClick={handleDecrease}
            >
                <UpOutlined />
            </button> 
            <div style={{ margin: '0px 8px', display: 'flex', flexShrink: '0', alignItems: "center" }}>
                <span>
                <input
                    type="text"
                    data-testid="page-navigation__current-page-input"
                    aria-label="Enter a page number"
                    className="input-pages text-black bg-white border-none font-normal text-[22px] leading-normal"
                    placeholder=""
                    value={inputPage}
                    onChange={handlePageInput}
                    onKeyDown={submitPageInput}
                />
                </span>
                <span style={{ margin: "0px 3px" }}>/</span>
                {pageCount}
            </div>
            <button 
                type="button" 
                className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                onClick={handleIncrease}
            >
                <DownOutlined />
            </button>               
            </div>
        </div>
    );
}

export default Topbar;