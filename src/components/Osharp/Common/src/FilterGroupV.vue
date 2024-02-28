<template>
  <Row class="group-box">
    <Col span="24" :style="{ 'background-color': group.level % 2 == 0 ? '#eee' : '#fff' }">
    <FilterGroupV v-for="subGroup in group.groups" :group="subGroup" :entity="entity" :key="subGroup['key']"
      @remove="handleRemoveGroup" />
    <FilterRuleV v-if="entityProperties.length > 0" v-for="rule in group.rules" :rule="rule" :properties="entityProperties"
      :key="rule['key']" @remove="handleRemoveRule" />
    <Row>
      <Col span="24">
      <Select v-model:value="group.operate" size="small">
        <SelectOption v-for="entry in defGroupOperateEntries" :key="entry.value" :value="entry.value">{{ entry.label }}
        </SelectOption>
      </Select>
      <Button size="small" @click="addGroup()">添加分组</Button>
      <Button size="small" @click="addRule()">添加条件</Button>
      <Button size="small" @click="fireRemove()" v-if="group.level > 1">删除分组</Button>
      </Col>
    </Row>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { Row, Col, Select, SelectOption, Button } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { buildShortUUID } from "/@/utils/uuid";
import { FilterGroup, FilterRule, FilterOperate, EntityProperty, defFilterGroup, defGroupOperateEntries } from '/@/utils/osharp';
import { FilterRuleV } from '/@/components/Osharp';
import { readEntityPropertiesApi } from '/@/api/osharp';

const props = defineProps<{ group: FilterGroup; entity: string; }>();

const entityProperties = ref<EntityProperty[]>([]);

const emits = defineEmits(['remove']);

watchEffect(async () => {
  if (props.group && (!props.group.level || props.group.level < 1)) {
    groupInit(props.group);
  }
  if (props.entity) {
    entityProperties.value = await readEntityPropertiesApi(props.entity);
  }
});

function groupInit(group: FilterGroup) {
  if (!group.level) {
    group.level = 1;
  }
  group.groups.forEach((subGroup) => {
    subGroup.level = group.level + 1;
    groupInit(subGroup);
  });
}

function addGroup() {
  let newGroup = cloneDeep(defFilterGroup);
  newGroup['key'] = buildShortUUID();
  newGroup.level = (props.group.level || 1) + 1;
  props.group.groups.push(newGroup);
}

function addRule() {
  if (entityProperties.value.length == 0) {
    return;
  }
  let newRule: FilterRule = {
    operate: FilterOperate.Equal,
    field: entityProperties.value[0].name,
    value: undefined,
    isLowerCaseToUpperCase: true,
  };
  newRule['key'] = buildShortUUID();
  if (!props.group.rules) {
    props.group.rules = [];
  }
  props.group.rules.push(newRule);
}

function fireRemove() {
  emits('remove', props.group);
}

function handleRemoveGroup(removedGroup: FilterGroup) {
  const index = props.group.groups.indexOf(removedGroup);
  if (index !== -1) {
    props.group.groups.splice(index, 1);
  }
}

function handleRemoveRule(removedRule: FilterRule) {
  const index = props.group.rules.indexOf(removedRule);
  if (index !== -1) {
    props.group.rules.splice(index, 1);
  }
}
</script>
<style lang="less" scoped>
.group-box {
  margin: 2px;
  padding: 3px;
  border: dashed 2px #ddd;
}
</style>
