import {
  ShieldCheck,
  ChefHat,
  UserCog,
} from "lucide-react";

interface Props {
  admin: number;
  staff: number;
  chef: number;
}

export default function UserStats({
  admin,
  staff,
  chef,
}: Props) {
  const stats = [
    {
      label: "Admin",
      value: admin,
      icon: ShieldCheck,
    },
    {
      label: "Staff",
      value: staff,
      icon: UserCog,
    },
    {
      label: "Chef",
      value: chef,
      icon: ChefHat,
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {item.value}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-3">
                <Icon className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}