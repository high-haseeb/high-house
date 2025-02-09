import { create } from 'zustand'

const useStateStore = create((set) => ({
    models: ["sandals", "clogs", "slippers"],
    colors: {
        "slippers": [
            { name: "black", value: "#333333", },
            { name: "cream", value: "#F7F3ED", },
            { name: "lime", value: "#D5D717", },
        ],
        "sandals": [
            { name: "black", value: "#333333", },
            { name: "cream", value: "#F7F3ED", },
            { name: "lime", value: "#D5D717", },
            { name: "mustard", value: "#FFCC00" },
        ],
        "clogs": [
            { name: "black", value: "#333333", },
            { name: "mustard", value: "#FFCC00" },
            { name: "beige", value: "#ffefcc", },
            { name: "brown", value: "#663300", },
        ],
    },
    straps: [
        { name: "Wave_anchor", src: "1.png" },
        { name: "Wave", src: "2.png" },
        { name: "Ming", src: "3.png" },
        { name: "Camp", src: "4.png" },
        { name: "Tears", src: "tears.png" },
    ],
    activeColor: "#F7F3ED",
    setActiveColor: (color) => set({ activeColor: color }),
    activeModel: "sandals",
    setActiveModel: (model) => set({ activeModel: model }),
    menuOpen: false,
    setMenuOpen: (open) => set({ menuOpen: open }),
}))

export default useStateStore;
