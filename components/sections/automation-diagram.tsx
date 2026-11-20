"use client";

import Image from "next/image";
import { Circuit } from "@/components/ui/circuit";
import automationIcon from "@/public/icons/services/automation.svg";
import crmIcon from "@/public/icons/services/crm.svg";
import googleIcon from "@/public/icons/services/google.svg";
import mailIcon from "@/public/icons/services/mail.svg";
import { FlowNode } from "./flow-node";

// A card lights up briefly when a signal lands on it.
const circuitNode =
  "rounded-sm transition-shadow duration-300 data-circuit-pulse:shadow-[0_0_0_3px_--alpha(var(--color-flamingo)/25%)]";

const automationFlow = ["email", "crm", "google"].map((from) => ({
  from,
  to: "automation",
  fromSide: "bottom" as const,
  toSide: "top" as const,
}));

export function AutomationDiagram({ playing }: { playing: boolean }) {
  return (
    <Circuit
      aria-hidden
      data-nosnippet
      flow={automationFlow}
      highlight="none"
      autoPlay={playing}
      interval={2.4}
      radius={8}
      pinSpacing={28}
      traceClassName="text-neutral-light"
      packetClassName="text-flamingo"
      className="border-border grid h-[14.5rem] shrink-0 content-between rounded-md border p-3 md:p-6"
    >
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <div data-circuit="email" className={circuitNode}>
          <FlowNode icon={mailIcon} label="Email" />
        </div>
        <div data-circuit="crm" className={circuitNode}>
          <FlowNode icon={crmIcon} label="CRM" />
        </div>
        <div data-circuit="google" className={circuitNode}>
          <FlowNode icon={googleIcon} label="Google" />
        </div>
      </div>
      <div
        data-circuit="automation"
        className={`${circuitNode} border-border mx-auto flex h-14 w-full max-w-64 items-center justify-center gap-2 border bg-white p-3.5`}
      >
        <Image src={automationIcon} alt="" width={24} height={24} />
        <span className="text-small font-semibold">AI automation</span>
      </div>
    </Circuit>
  );
}
