import {SidebarContent} from "../../MapPage.tsx";


function NewLocationButton({ sidebarContent, isSidebarOpen }) {
    return (
        <div
            className="fixed top-32 right-0 border-4 border-black w-20 h-16 flex items-center justify-center rounded-l-lg transition-transform duration-500 ease-in-out"
            style={{
                backgroundColor: sidebarContent === SidebarContent.NEW_LOCATION ? 'rgba(256, 256, 256, 0.7)' : 'rgba(0, 0, 0, 0.8)',
                transform: isSidebarOpen ? 'translateX(-500px)' : 'translateX(0)',
                color: sidebarContent === SidebarContent.NEW_LOCATION ? 'black' : 'white',
            }}
        >
            <span className="text-2xl mb-1">+</span>
            <img
                src={`https://img.icons8.com/?size=100&id=85353&format=png&color=${sidebarContent === SidebarContent.NEW_LOCATION ? '000000' : 'FFFFFF'}`}
                className="w-8 h-8 transition-none"
                alt="New Location Icon"
            />
        </div>
    );
}

export default NewLocationButton;