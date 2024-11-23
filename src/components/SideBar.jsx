"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import ComingSoon from "./ComingSoon";
import SvgTwillinkLogo from "../assets/svgComponents/SvgTwillinkLogo";
import SvgTwilmeetIcon from "../assets/svgComponents/SvgTwilmeetIcon";
import Image from "next/image";
// import twilmeetAds from '@/assets/gifs/twilmeet-ads.gif';
import Link from "next/link";

const Sidebar = ({ menus = [] }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = async (path) => {
    try {
      await router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="drawer-side z-50">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="h-full p-0 md:p-6">
        <div className="flex flex-col justify-between bg-contras-high h-full w-21 rounded-r-3xl md:rounded-3xl shadow-[rgba(59,63,81,0.12)_0px_8px_16px_0px]">
          <div>
            <div className="flex justify-center items-center p-6">
              <Image
                src="/images/logo.png"
                width={50}
                height={1}
                alt="twilmeet-ads"
                priority={false}
                className={"w-[100px] md:w-100"}
              />
            </div>
            <ul className="menu gap-3 text-sm font-semibold">
              {menus.map((item, index) => {
                const itemClasses = `rounded-lg ${
                  pathname === item.path ? "bg-base-200" : ""
                } ${
                  item.disabled
                    ? "disabled pointer-events-none !text-general-med"
                    : "text-general-high"
                }`;
                return (
                  <li key={index.toString()} className={itemClasses}>
                    {item.path && (
                      <button
                        type="button"
                        onClick={() => handleClick(item.path)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        {item.icon && (
                          <span className="text-xl">{item.icon}</span>
                        )}
                        <span className="text-center text-xs font-medium">
                          {item.title}
                        </span>
                        {item.disabled && <ComingSoon className="mt-2" />}
                      </button>
                    )}
                    {item.menuChild && (
                      <details
                        id="disclosure-components"
                        className={`text-general-high ${
                          item.disabled
                            ? "pointer-events-none text-general-med"
                            : ""
                        }`}
                      >
                        <summary className="group gap-4">
                          {item.icon && item.icon}

                          {item.title}
                          {item.disabled && <ComingSoon />}
                        </summary>
                        <ul className="before:hidden">
                          {item.menuChild.map((child, idx) => {
                            const childClasses = `rounded-lg ${
                              pathname === child.path ? "bg-base-200" : ""
                            }`;
                            return (
                              <li key={`child-${idx}`} className={childClasses}>
                                <Link href={child.path}>
                                  <div className="group pl-8 gap-4">
                                    {child.icon && child.icon}
                                    {child.title}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
