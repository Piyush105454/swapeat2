import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Home, Calendar, Settings, LogOut } from "lucide-react";

export const DashboardScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brandmain rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-sm">
                  Good Morning
                </h3>
                <p className="[font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-lg">
                  John Doe
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <Search className="w-5 h-5 text-uigray-80" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 rounded-full relative"
              >
                <Bell className="w-5 h-5 text-uigray-80" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="absolute top-[160px] left-[20px] right-[20px] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-brandmain/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brandmain" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-uigray-80 [font-family:'Poppins',Helvetica]">24</p>
                <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">Tasks Today</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-uigray-80 [font-family:'Poppins',Helvetica]">18</p>
                <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">Completed</p>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                  Today's Progress
                </h3>
                <span className="text-sm text-brandmain font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brandmain h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 [font-family:'Poppins',Helvetica]">
                Great job! You're almost there.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center space-x-2 border-brandmain/20 hover:bg-brandmain/5"
                >
                  <Calendar className="w-4 h-4 text-brandmain" />
                  <span className="text-sm font-medium text-uigray-80">Schedule</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 flex items-center justify-center space-x-2 border-brandmain/20 hover:bg-brandmain/5"
                >
                  <Settings className="w-4 h-4 text-brandmain" />
                  <span className="text-sm font-medium text-uigray-80">Settings</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-[20px] left-[20px] right-[20px] bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 p-2 text-brandmain"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs font-medium">Calendar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};