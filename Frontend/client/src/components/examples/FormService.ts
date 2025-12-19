import base from "@/components/proposals/baseForm.json";
import speaker from "@/components/proposals/Speaker.json";
import sponsor from "@/components/proposals/Sponsor.json";
import communityPartner from "@/components/proposals/CommunityPartner.json";
import volunteer from "@/components/proposals/Volunteer.json";

const map = {
  speaker,
  sponsor,
  communityPartner,
  volunteer,
};

export function getForm(type) {
  return [...base, ...map[type]];
}
