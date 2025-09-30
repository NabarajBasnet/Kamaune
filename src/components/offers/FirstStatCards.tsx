import { Card } from "../ui/card";
import { Gift, ShoppingCart, Star, Target, Users, TrendingUp } from "lucide-react";

const FirstStatCards = ({ offers }: any) => {
    return (
        <div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Offers
                        </h3>
                        <Gift className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                        {offers.totalOffers}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                        +8% from last month
                    </p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Active Offers
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                        </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                        {offers.activeOffers}
                    </p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        Currently live
                    </p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            App Orders
                        </h3>
                        <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                        {offers.totalAppOrders.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        Total orders
                    </p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Avg Rating
                        </h3>
                        <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                        {offers.avgRating > 0 ? offers.avgRating.toFixed(1) : "0.0"}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Based on customer reviews
                    </p>
                </Card>
            </div> */}
        </div>
    )
}

export default FirstStatCards;
