import React, { createContext, useContext, useId } from "react";

type TabsContext = { value: string; onValueChange: (value: string) => void; id: string };
const Context = createContext<TabsContext | null>(null);
const useTabs = () => { const context = useContext(Context); if (!context) throw new Error("Tabs fora do grupo"); return context; };

export function Tabs({value,onValueChange,className,children}:{value:string;onValueChange:(value:string)=>void;className?:string;children:React.ReactNode}) {
  const id=useId(); return <Context.Provider value={{value,onValueChange,id}}><div className={className}>{children}</div></Context.Provider>;
}
export function TabsList({children,className,...rest}:React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={className} {...rest}>{children}</div>;
}
export function TabsTrigger({value,className,children}: {value:string;className?:string;children:React.ReactNode}) {
  const tabs=useTabs(); const active=tabs.value===value;
  const onKeyDown=(event:React.KeyboardEvent<HTMLButtonElement>)=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    const triggers=Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') || []);
    const index=triggers.indexOf(event.currentTarget);
    const next=event.key==="Home"?0:event.key==="End"?triggers.length-1:(index+(event.key==="ArrowRight"?1:-1)+triggers.length)%triggers.length;
    event.preventDefault(); triggers[next]?.focus(); triggers[next]?.click();
  };
  return <button type="button" role="tab" id={`${tabs.id}-tab-${value}`} aria-controls={`${tabs.id}-panel-${value}`} aria-selected={active} tabIndex={active?0:-1} data-state={active?"active":"inactive"} className={className} onClick={()=>tabs.onValueChange(value)} onKeyDown={onKeyDown}>{children}</button>;
}
export function TabsContent({value,className,children}:{value:string;className?:string;children:React.ReactNode}) {
  const tabs=useTabs(); return <div role="tabpanel" id={`${tabs.id}-panel-${value}`} aria-labelledby={`${tabs.id}-tab-${value}`} hidden={tabs.value!==value} className={className}>{children}</div>;
}
