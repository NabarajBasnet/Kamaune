import { Card } from "../ui/card";
import { Gift, ShoppingCart, Star, Target, Users, TrendingUp } from "lucide-react";

const SecondStatCards = ({ offers }: any) => {
    return (
        <div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Performance
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {offers.activeOffers > 0 ? Math.round((offers.activeOffers / offers.totalOffers) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Conversion Rate
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                12.5%
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Merchants
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {new Set(offers.map((o: any) => o.merchant.slug)).size}
                            </p>
                        </div>
                    </div>
                </Card>
            </div> */}
        </div>
    )
}

export default SecondStatCards;
