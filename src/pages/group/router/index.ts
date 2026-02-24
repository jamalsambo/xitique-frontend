import List from '../pages/GroupsPage.vue';
import Detalhes from '../pages/GroupDetailsPage.vue';
import Settings from '../pages/GroupSettingsPage.vue'
import Cycle from '../pages/GroupCyclePage.vue'

const groupRoutes = [
  { path: 'groups', name: 'list', component: List },
  { path: 'groups/:id', name: 'group-detalhes', component: Detalhes },
   { path: 'groups/:id/settings', name: 'group-settings', component: Settings },
    { path: 'groups/:id/cycle/:cycleId', name: 'group-cycle', component: Cycle },
];

export default groupRoutes;
