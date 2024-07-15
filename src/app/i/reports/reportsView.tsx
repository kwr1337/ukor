'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from "@/components/ui/Heading";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/buttons/Button";
import {DASHBOARD_PAGES} from "@/config/pages-url.config";



export function ReportsView() {

    const router = useRouter();

    const rout = (rep: string) => {

        switch (rep) {

            case 'remaining-stock':
                router.push(DASHBOARD_PAGES.REPORTSremainingstock)
                break;

            case 'koreaAll':
                router.push(DASHBOARD_PAGES.REPORTSKorAll)
                break;
            case 'korea-count':
                router.push(DASHBOARD_PAGES.REPORTSKorAllCOUNT)
                break;
            case 'korea-date':
                router.push(DASHBOARD_PAGES.REPORTSKorAllDATE)
                break;

            case 'chinaAll':
                router.push(DASHBOARD_PAGES.REPORTSChinaAll)
                break;
            case 'china-date':
                router.push(DASHBOARD_PAGES.REPORTSChinaAllDATE)
                break;
            case 'china-count':
                router.push(DASHBOARD_PAGES.REPORTSChinaAllCOUNT)
                break;

            case 'All':
                router.push(DASHBOARD_PAGES.REPORTSAll)
                break;
            case 'all-date':
                router.push(DASHBOARD_PAGES.REPORTSAllDATE)
                break;
            case 'all-count':
                router.push(DASHBOARD_PAGES.REPORTSAllCOUNT)
                break;
        }

    }

    return (
        <div>
            <div className="max-w-8xl w-full mx-auto space-y-8">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('remaining-stock')}>Отчет по остаткам на складе</Button>
                    </div>
                    <div className="px-6 py-4">
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('All')}>Общее</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('all-date')}>Общее дата кол-во</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('all-count')}>Общее кол-во</Button>
                    </div>
                    <div className="px-6 py-4">
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('chinaAll')} >Китай</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('china-date')}>Китай дата кол-во</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('china-count')}>Китай кол-во</Button>
                    </div>
                    <div className="px-6 py-4">
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('koreaAll') }>Корея</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('korea-date') }>Корея дата кол-во</Button>
                        <Button className="bg-primary text-white px-4 py-2 rounded mr-3" onClick={ e => rout('korea-count') }>Корея кол-во</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
