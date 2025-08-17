import React from 'react';

const nseIndices = [
  { name: "NIFTY 50", value: "24,750.30", change: "+125.50", percent: "+0.51%" },
  { name: "NIFTY BANK", value: "51,234.75", change: "-89.25", percent: "-0.17%" },
  { name: "NIFTY IT", value: "43,892.10", change: "+256.80", percent: "+0.59%" },
  { name: "NIFTY AUTO", value: "23,456.90", change: "+123.45", percent: "+0.53%" },
  { name: "NIFTY PHARMA", value: "19,876.45", change: "-45.60", percent: "-0.23%" },
  { name: "NIFTY FMCG", value: "67,543.20", change: "+234.10", percent: "+0.35%" },
  { name: "NIFTY METAL", value: "8,765.43", change: "-56.78", percent: "-0.64%" },
  { name: "NIFTY ENERGY", value: "34,567.89", change: "+145.67", percent: "+0.42%" },
];

export const TickerTape: React.FC = () => {
  return (
    <div className="bg-blue-800 text-white py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <div className="inline-flex items-center gap-8">
          <span className="font-semibold text-sm">ALL SECTOR WISE % & NET CHANGE (FREQ ON TOP ROW) Including India Vix-NO OF ADVANCE/DECLINE</span>
          {nseIndices.map((index, i) => (
            <div key={i} className="inline-flex items-center gap-2">
              <span className="font-medium text-sm">{index.name}:</span>
              <span className="text-sm">{index.value}</span>
              <span className={`text-sm font-medium ${index.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                {index.change} ({index.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
};