import { AiOutlineMoneyCollect } from "react-icons/ai"
import { MdBorderClear } from "react-icons/md"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

function DashboardHero() {


  const stats = [
    {
      icon: AiOutlineMoneyCollect,
      label: "Account Balance",
      sublabel: "(with 10% service charge)",
      value: "$0.00",
      link: "/dashboard-withdraw-money",
      linkText: "Withdraw Money",
    },
    {
      icon: MdBorderClear,
      label: "All Orders",
      value: "0",
      link: "/dashboard-orders",
      linkText: "View Orders",
    },
    {
      icon: AiOutlineMoneyCollect,
      label: "All Products",
      value: "0",
      link: "/dashboard-products",
      linkText: "View Products",
    },
  ]

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-semibold pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="w-full mb-4 800px:w-[30%]">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <Icon size={30} className="mr-2" fill="#00000085" />
                  <div>
                    <h3 className="text-[18px] font-[400] text-[#00000085] leading-5">
                      {stat.label}
                    </h3>
                    {stat.sublabel && (
                      <span className="text-[14px] text-[#00000085]">
                        {stat.sublabel}
                      </span>
                    )}
                  </div>
                </div>
                <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                  {stat.value}
                </h5>
                <Link to={stat.link}>
                  <h5 className="pt-4 pl-[2] text-[#077f9c] cursor-pointer">
                    {stat.linkText}
                  </h5>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <br />
      <h3 className="text-[22px] font-semibold pb-2">Latest Orders</h3>
      <Card className="w-full mb-4">
        <CardContent className="p-5">
          <p className="text-[#555]">No orders yet</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardHero
