'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

export const COUNTRY_CODES: Record<string, string> = {
  'United States': 'us',
  'India': 'in',
  'United Kingdom': 'gb',
  'China': 'cn',
  'Brazil': 'br',
  'France': 'fr',
  'Germany': 'de',
  'Canada': 'ca',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Spain': 'es',
  'Australia': 'au',
  'United Arab Emirates': 'ae',
  'Turkey': 'tr',
  'Indonesia': 'id',
  'Mexico': 'mx',
  'Pakistan': 'pk',
  'Switzerland': 'ch',
  'Japan': 'jp',
  'South Africa': 'za',
  'Poland': 'pl',
  'Saudi Arabia': 'sa',
  'Singapore': 'sg',
  'Sweden': 'se',
  'Egypt': 'eg',
  'Bangladesh': 'bd',
  'Belgium': 'be',
  'Nigeria': 'ng',
  'Argentina': 'ar',
  'Denmark': 'dk',
  'Colombia': 'co',
  'Vietnam': 'vn',
  'Portugal': 'pt',
  'Philippines': 'ph',
  'Malaysia': 'my',
  'Chile': 'cl',
  'Iran': 'ir',
  'Norway': 'no',
  'Israel': 'il',
  'Taiwan': 'tw',
  'Peru': 'pe',
  'Hong Kong': 'hk',
  'Russia': 'ru',
  'Austria': 'at',
  'Ireland': 'ie',
  'South Korea': 'kr',
  'Kenya': 'ke',
  'Morocco': 'ma',
  'Finland': 'fi',
  'Romania': 'ro',
  'Czechia': 'cz',
  'Ukraine': 'ua',
  'Greece': 'gr',
  'New Zealand': 'nz',
  'Thailand': 'th',
  'Sri Lanka': 'lk',
  'Qatar': 'qa',
  'Ecuador': 'ec',
  'Hungary': 'hu',
  'Ghana': 'gh',
  'Tunisia': 'tn',
  'Bulgaria': 'bg',
  'Jordan': 'jo',
  'Lithuania': 'lt',
  'Nepal': 'np',
  'Cyprus': 'cy',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Algeria': 'dz',
  'Uganda': 'ug',
  'Slovakia': 'sk',
  'Malta': 'mt',
  'Estonia': 'ee',
  'Azerbaijan': 'az',
  'Lebanon': 'lb',
  'Iraq': 'iq',
  'Luxembourg': 'lu',
  'Kuwait': 'kw',
  'Croatia': 'hr',
  'Venezuela': 've',
  'Cameroon': 'cm',
  'Dominican Republic': 'do',
  'Ivory Coast': 'ci',
  'Costa Rica': 'cr',
  'Uruguay': 'uy',
  'Georgia': 'ge',
  'Guatemala': 'gt',
  'Ethiopia': 'et',
  'Angola': 'ao',
  'Oman': 'om',
  'Slovenia': 'si',
  'Cambodia': 'kh',
  'Democratic Republic of the Congo': 'cd',
  'Zimbabwe': 'zw',
  'Kazakhstan': 'kz',
  'Tanzania': 'tz',
  'Latvia': 'lv',
  'Panama': 'pa',
  'Bahrain': 'bh',
  'Armenia': 'am',
  'Myanmar': 'mm',
  'Puerto Rico': 'pr',
  'Belarus': 'by',
  'Zambia': 'zm',
  'Bolivia': 'bo',
  'Albania': 'al',
  'Bosnia and Herzegovina': 'ba',
  'Mauritius': 'mu',
  'Paraguay': 'py',
  'El Salvador': 'sv',
  'Mozambique': 'mz',
  "Côte D'ivoire": 'ci',
  'Benin': 'bj',
  'Uzbekistan': 'uz',
  'Honduras': 'hn',
  'Papua New Guinea': 'pg',
  'Madagascar': 'mg',
  'Rwanda': 'rw',
  'Afghanistan': 'af',
  'Sudan': 'sd',
  'Maldives': 'mv',
  'Togo': 'tg',
  'Guinea': 'gn',
  'Syria': 'sy',
  'Iceland': 'is',
  'Burkina Faso': 'bf',
  'Libya': 'ly',
  'Nicaragua': 'ni',
  'Moldova': 'md',
  'Trinidad and Tobago': 'tt',
  'Somalia': 'so',
  'Yemen': 'ye',
  'Jamaica': 'jm',
  'Malawi': 'mw',
  'Mali': 'ml',
  'Monaco': 'mc',
  'Gabon': 'ga',
  'Namibia': 'na',
  'Botswana': 'bw',
  'Kosovo': 'xk',
  'Macedonia': 'mk',
  'Republic of the Congo': 'cg',
  'Cuba': 'cu',
  'Haiti': 'ht',
  'Mongolia': 'mn',
  'Montenegro': 'me',
  'Reunion': 're',
  'Cayman Islands': 'ky',
  'Isle of Man': 'im',
  'Bahamas': 'bs',
  'Liberia': 'lr',
  'Curacao': 'cw',
  'Palestinian Territory': 'ps',
  'North Macedonia': 'mk',
  'Czech Republic': 'cz',
  'South Sudan': 'ss',
  'British Virgin Islands': 'vg',
  'Liechtenstein': 'li',
  'Sierra Leone': 'sl',
  'Gibraltar': 'gi',
  'Fiji': 'fj',
  'Martinique': 'mq',
  'Niger': 'ne',
  'Palestine': 'ps',
  'New Caledonia': 'nc',
  'Chad': 'td',
  'Suriname': 'sr',
  'Kyrgyzstan': 'kg',
  'Mauritania': 'mr',
  'Guadeloupe': 'gp',
  'Guam': 'gu',
  'Andorra': 'ad',
  'Seychelles': 'sc',
  'Brunei': 'bn',
  'Jersey': 'je',
  'Barbados': 'bb',
  'Belize': 'bz',
  'Guyana': 'gy',
  'Guernsey': 'gg',
  'Macao': 'mo',
  'French Polynesia': 'pf',
  'Tajikistan': 'tj',
  'Faroe Islands': 'fo',
  'Réunion': 're',
  'French Guiana': 'gf',
  'Djibouti': 'dj',
  'Burundi': 'bi',
  'Bermuda': 'bm',
  'Aruba': 'aw',
  'San Marino': 'sm',
  'Saint Lucia': 'lc',
  'Cape Verde': 'cv',
  'Laos': 'la',
  'Lesotho': 'ls',
  'Swaziland': 'sz',
  'Antigua and Barbuda': 'ag',
  'Macau': 'mo',
  'Curaçao': 'cw',
  'U.s. Virgin Islands': 'vi',
  'Equatorial Guinea': 'gq',
  'Bhutan': 'bt',
  'São Tomé and Príncipe': 'st',
  'Comoros': 'km',
  'Gambia': 'gm',
  'Greenland': 'gl',
  'Central African Republic': 'cf',
  'Mayotte': 'yt',
  'Eswatini': 'sz',
  'The Gambia': 'gm',
  'Vanuatu': 'vu',
  'Saint Vincent and the Grenadines': 'vc',
  'Vatican': 'va',
  'Nauru': 'nr',
  'European Union': 'eu',
  'Saint Pierre and Miquelon': 'pm',
  'Marshall Islands': 'mh',
  'Samoa': 'ws',
  'Guinea-bissau': 'gw',
  'Turks and Caicos Islands': 'tc',
  'Northern Mariana Islands': 'mp',
  'Saint Kitts and Nevis': 'kn',
  'Timor-leste': 'tl',
  'Grenada': 'gd',
  'Solomon Islands': 'sb',
  'British Indian Ocean Territory': 'io',
  'American Samoa': 'as',
  'Serbia and Montenegro': 'rs',
  'Vatican City': 'va',
  'East Timor': 'tl',
  'Tonga': 'to',
  'Saint Barthelemy': 'bl',
  'Turkmenistan': 'tm',
  'North Korea': 'kp',
  'Dominica': 'dm',
  'Sao Tome and Principe': 'st',
  'Cook Islands': 'ck',
  'Saint Martin': 'mf',
  'Netherlands Antilles': 'an',
  'Kiribati': 'ki',
  'Tokelau': 'tk',
  'Montserrat': 'ms',
  'Bonaire, Saint Eustatius and Saba': 'bq',
  'Anguilla': 'ai',
  'Svalbard and Jan Mayen': 'sj',
  'South Georgia and the South Sandwich Islands': 'gs',
  'Caribbean Netherlands': 'bq',
  'Antarctica': 'aq',
  'Sint Maarten': 'sx',
  'Aland Islands': 'ax',
  'Wallis and Futuna': 'wf',
  'French Southern Territories': 'tf',
  'Saint Helena': 'sh',
  'Congo': 'cg',
  'Saint Barthélemy': 'bl',
  'Bouvet Island': 'bv',
  'Åland Islands': 'ax',
  'United States Minor Outlying Islands': 'um',
  'Norfolk Island': 'nf',
  'Micronesia': 'fm',
  'Falkland Islands': 'fk'
};

interface CustomCountrySelectProps {
  value: string;
  onChange: (country: string) => void;
  className?: string;
}

const COUNTRY_LIST = Object.keys(COUNTRY_CODES);

export function CustomCountrySelect({ value, onChange, className = '' }: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCode = COUNTRY_CODES[value] || 'us';

  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w40/${selectedCode}.png`}
            alt={value}
            className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs shrink-0"
          />
          <span className="truncate max-w-[120px]">{value}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Scrollable Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Search Input Box */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Scrollable Countries List */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 p-1 custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const code = COUNTRY_CODES[country] || 'un';
                  const isSelected = country === value;
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        onChange(country);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/w40/${code}.png`}
                          alt={country}
                          className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs shrink-0"
                        />
                        <span>{country}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">No country found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
