<script setup lang="ts">
import { config } from '../config'
import { useAppStore } from '../stores/app.js'
import { useGetAllModsQuery } from '../api/useGetModsQuery'

import ModInfo from './Modinfo.vue'

const store = useAppStore()

// const { data, error } = useFetch('/api/mods/', {
//   afterFetch(ctx) {
//     store.mods = ctx.data.mods
//     return ctx
//   }
// }).get().json()

const getAllModsQuery = useGetAllModsQuery()

const sortedMods = getAllModsQuery.data.mods.sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="row flex-grow-1" v-if="store.section === 'mods'">
    <div v-if="error" class="row text-danger">
      {{ error }}
    </div>
    <div class="col-md-3 border" v-if="data">
      <div>
        <h4 class="text-center">Installed Mods</h4>
        <table>
          <tr>
            <th>Steam Link</th>
            <th>Mod Name</th>
          </tr>
          <template
              v-for="mod in sortedMods"
          >
            <tr>
              <td>
                <a
                    target="_blank"
                    :href="config.steamUrl + mod.id"
                >
                  {{ mod.id }}
                </a>
              </td>
              <td>
                <a
                    :class="'simulink' + (store.modId === parseInt(mod.id) ? ' active' : '')"
                    @click="store.modFile='';store.modId=parseInt(mod.id)"
                >
                  {{ mod.name }}
                </a>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
    <ModInfo />
  </div>
</template>
