import { Bookmark, CarFront, ClipboardList, Home, ShieldCheck, Wrench } from "lucide-react";

type UserType = "mechanic" | null;

export const getBarLinks = (userType: UserType = null) => {
   const baseLinks = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Repairs",
      href: "/repair",
      icon: Wrench,
    },
    {
      title: "Bookings",
      href: "/bookings",
      icon: Bookmark,
    },
    {
      title: "Apply to be a mechanic",
      href: "/mechanic/home",
      icon: CarFront,
    },
  ];

  if (userType === "mechanic") {
    baseLinks.push({
      title: "Requested Service",
      href: "/mechanic/requested_service",
      icon: ClipboardList,
    });
  }

  return baseLinks;
};

export const footerSections = [
    {
        title: "Help",
        links: [
            { name: "About us", path: "/about-us" },
            { name: "FAQs", path: "/frequently-asked-questions" },
            { name: "Privacy policy", path: "/privacy-policy" },
            { name: "Payment policy", path: "/payment-policy" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "Email us", path: "mailto:mizspacetech@gmail.com" },
            { name: "Call us", path: "tel:+962780505973" },
        ],
    },
];