var standard = [
  "account",
  "announcement",
  "approval",
  "apps",
  "article",
  "avatar",
  "calibration",
  "call",
  "campaign",
  "campaign_members",
  "canvas",
  "case",
  "case_change_status",
  "case_comment",
  "case_email",
  "case_log_a_call",
  "case_transcript",
  "client",
  "coaching",
  "connected_apps",
  "contact",
  "contract",
  "custom",
  "dashboard",
  "default",
  "document",
  "drafts",
  "email",
  "email_chatter",
  "empty",
  "endorsement",
  "environment_hub",
  "event",
  "feed",
  "feedback",
  "file",
  "flow",
  "folder",
  "forecasts",
  "generic_loading",
  "goals",
  "group_loading",
  "groups",
  "hierarchy",
  "home",
  "household",
  "insights",
  "investment_account",
  "lead",
  "link",
  "log_a_call",
  "marketing_actions",
  "merge",
  "metrics",
  "news",
  "note",
  "opportunity",
  "orders",
  "people",
  "performance",
  "person_account",
  "photo",
  "poll",
  "portal",
  "post",
  "pricebook",
  "process",
  "product",
  "question_best",
  "question_feed",
  "quotes",
  "recent",
  "record",
  "related_list",
  "relationships",
  "report",
  "reward",
  "sales_path",
  "scan_card",
  "service_contract",
  "skill_entity",
  "social",
  "solution",
  "sossession",
  "task",
  "task2",
  "team_member",
  "thanks",
  "thanks_loading",
  "today",
  "topic",
  "unmatched",
  "user",
  "work_order",
  "work_order_item"
];
var iconMap = {};
function makeStandardIcon(iconName) {
  return {
    sprite: "standard",
    icon: iconName
  };
}
function getIcon(objectType, noDefault) {
  // SF order iconName is plural but the objectType name is singular
  if (objectType.toLowerCase() === "order") {
    iconMap[objectType.toLowerCase()] = makeStandardIcon("orders");
  }

  if (!iconMap || !iconMap.length) {
    standard.forEach(function (icon) {
      iconMap[icon] = makeStandardIcon(icon);
    });
  }
  let found = null,
    objectTypeParts = objectType.split(" ");
  while (!found && objectTypeParts.length > 0) {
    found = iconMap[objectTypeParts.join(" ").toLowerCase()];
    objectTypeParts.pop(); // remove last item
  }
  if (!found) {
    return noDefault
      ? null
      : {
          sprite: "custom",
          icon: "custom91"
        };
  }
  return found;
}
export default getIcon;
