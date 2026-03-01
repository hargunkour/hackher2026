export const resources = {
  // City-level resources (checked first)
  "Toronto": [
    {
      id: "to1",
      name: "Toronto Rape Crisis Centre (TRCC)",
      phone: "416-597-8808",
      description: "24/7 crisis line for survivors of sexual violence in Toronto.",
    },
    {
      id: "to2",
      name: "Toronto Distress Centres",
      phone: "416-929-5200",
      description: "24/7 emotional crisis support.",
    },
  ],

  "Vancouver": [
    {
      id: "van1",
      name: "Vancouver Rape Relief & Women's Shelter",
      phone: "604-872-8212",
      description: "24/7 crisis line and transition house support.",
    },
    {
      id: "van2",
      name: "Battered Women's Support Services",
      phone: "1-855-687-1868",
      description: "Support and advocacy for women experiencing violence.",
    },
  ],

  "Ottawa": [
    {
      id: "ott1",
      name: "Ottawa Rape Crisis Centre",
      phone: "613-562-2333",
      description: "24/7 crisis support for sexual and gender-based violence.",
    },
    {
      id: "ott2",
      name: "Ottawa Distress Centre",
      phone: "613-238-3311",
      description: "24/7 emotional crisis and suicide prevention support.",
    },
  ],

  "Hamilton": [
    {
      id: "ham1",
      name: "Interval House of Hamilton",
      phone: "905-387-8881",
      description: "24/7 crisis shelter and support for abused women.",
    },
    {
      id: "ham2",
      name: "Sexual Assault Centre Hamilton (SACHA)",
      phone: "905-525-4162",
      description: "24/7 sexual assault crisis line and counselling.",
    },
  ],

  "Kingston": [
    {
      id: "king1",
      name: "Sexual Assault Centre Kingston",
      phone: "1-877-544-6424",
      description: "24/7 crisis line and survivor support.",
    },
    {
      id: "king2",
      name: "Kingston Interval House",
      phone: "1-800-267-9445",
      description: "Emergency shelter and crisis support services.",
    },
  ],

  // Province-level resources (fallback if no city match)
  "Ontario": [
    {
      id: "on1",
      name: "Assaulted Women's Helpline",
      phone: "1-866-863-0511",
      description: "24/7 confidential crisis support for women across Ontario.",
    },
    {
      id: "on2",
      name: "Fem’aide (French)",
      phone: "1-877-336-2433",
      description: "24/7 French-language support for women in Ontario.",
    },
    {
      id: "on3",
      name: "Talk4Healing",
      phone: "1-855-554-4325",
      description: "24/7 support for Indigenous women in Ontario.",
    },
    {
      id: "on4",
      name: "Kids Help Phone",
      phone: "1-800-668-6868",
      description: "24/7 national youth crisis and text support (Ontario accessible).",
    },
  ],

  "British Columbia": [
    {
      id: "bc1",
      name: "VictimLink BC",
      phone: "1-800-563-0808",
      description: "24/7 confidential crisis and referral service across BC.",
    },
  ],

  "Alberta": [
    {
      id: "ab1",
      name: "Family Violence Info Line",
      phone: "780-310-1818",
      description: "24/7 multilingual domestic violence support across Alberta.",
    },
    {
      id: "ab2",
      name: "Alberta One Line for Sexual Violence",
      phone: "1-866-403-8000",
      description: "Province-wide sexual violence support line.",
    },
  ],

  "Quebec": [
    {
      id: "qc1",
      name: "SOS violence conjugale",
      phone: "1-800-363-9010",
      description: "24/7 bilingual domestic violence crisis line.",
    },
    {
      id: "qc2",
      name: "Sexual Violence Helpline",
      phone: "1-888-933-9007",
      description: "Support after sexual assault across Quebec.",
    },
  ],

  // Default (nationwide fallback)
  DEFAULT: [
    {
      id: "ca1",
      name: "Talk Suicide Canada",
      phone: "1-833-456-4566",
      description: "24/7 nationwide suicide prevention support.",
    },
    {
      id: "ca2",
      name: "Hope for Wellness (Indigenous)",
      phone: "1-855-242-3310",
      description: "24/7 mental health counselling for Indigenous peoples.",
    },
    {
      id: "ca3",
      name: "Canadian Human Trafficking Hotline",
      phone: "1-833-900-1010",
      description: "24/7 confidential support across Canada.",
    },
    {
      id: "ca4",
      name: "Kids Help Phone",
      phone: "1-800-668-6868",
      description: "24/7 national youth crisis support (call or text 686868).",
    },
  ],
};