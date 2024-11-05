import React, { useState, useEffect } from "react";
import ScrollTrigger from "react-scroll-trigger";
import CountUp from "react-countup";
import api from "../../api";
import { toast } from "react-toastify";

const Section1 = () => {
  const [counterState, setCounterState] = useState(false);
  const [stats, setStats] = useState({
    verifiedAlumni: 0,
    events: 0,
    jobs: 0,
    surveys: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="bg-teal-500 text-white px-6 md:px-10 lg:px-20 rounded-3xl">
      <div className="py-12">
        <ScrollTrigger
          onEnter={() => setCounterState(true)}
          onExit={() => setCounterState(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-center gap-6">
            <div>
              <h2 className="text-6xl font-bold text-[#262626]">
                {counterState && (
                  <CountUp
                    className="text-white"
                    start={0}
                    end={stats.verifiedAlumni}
                    duration={2.5}
                  />
                )}
                <span className="text-white">+</span>
              </h2>
              <p className="py-2 text-2xl font-medium p-4 rounded-md">
                Total Alumni
              </p>
            </div>
            <hr className="md:hidden" />
            <div>
              <h2 className="text-6xl font-bold text-[#262626]">
                {counterState && (
                  <CountUp
                    className="text-white"
                    start={0}
                    end={stats.events}
                    duration={2.5}
                  />
                )}
                <span className="text-white">+</span>
              </h2>
              <p className="py-2 text-2xl font-medium p-4 rounded-md">
                Total Events
              </p>
            </div>
            <hr className="md:hidden" />
            <div>
              <h2 className="text-6xl font-bold text-[#262626]">
                {counterState && (
                  <CountUp
                    className="text-white"
                    start={0}
                    end={stats.jobs}
                    duration={2.5}
                  />
                )}
                <span className="text-white">+</span>
              </h2>
              <p className="py-2 text-2xl font-medium p-4 rounded-md">
                Total Job Posts
              </p>
            </div>
            <hr className="md:hidden" />
            <div>
              <h2 className="text-6xl font-bold text-[#262626]">
                {counterState && (
                  <CountUp
                    className="text-white"
                    start={0}
                    end={stats.surveys}
                    duration={2.5}
                  />
                )}
                <span className="text-white">+</span>
              </h2>
              <p className="py-2 text-2xl font-medium p-4 rounded-md">
                Total Surveys
              </p>
            </div>
          </div>
        </ScrollTrigger>
      </div>
    </section>
  );
};

export default Section1;
