<template>
  <Row class="group-box">
    <Col span="24" :style="{ 'background-color': refGroup.level % 2 == 0 ? '#eee' : '#fff' }">
      <FilterGroupV v-for="subGroup in refGroup.groups" :group="subGroup" :entity="entity" :key="getHashCode(subGroup)" @remove="handleRemoveGroup" />
      <FilterRuleV v-for="rule in refGroup.rules" :rule="rule" :properties="entityProperties" :key="getHashCode(rule)" @remove="handleRemoveRule" />
      <Row>
        <Col span="24">
          <Select v-model:value="refGroup.operate" size="small">
            <SelectOption v-for="entry in defGroupOperateEntries" :key="entry.value" :value="entry.value">{{ entry.label }}</SelectOption>
          </Select>
          <Button size="small" @click="addGroup()">添加分组</Button>
          <Button size="small" @click="addRule()">添加条件</Button>
          <Button size="small" @click="fireRemove()" v-if="refGroup.level > 1">删除分组</Button>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
  import { PropType, ref, watchEffect } from 'vue';
  import { Row, Col, Select, SelectOption, Button } from 'ant-design-vue';
  import { cloneDeep } from 'lodash';
  import { FilterGroup, FilterRule, getHashCode, FilterOperate, EntityProperty, defFilterGroup, defGroupOperateEntries } from '/@/utils/osharp';
  import { FilterRuleV } from '/@/components/Osharp';
  import { readEntityPropertiesApi } from '/@/api/osharp';

  const props = defineProps({
    group: { type: Object as PropType<FilterGroup>, required: true },
    entity: { type: String, required: true },
  });
  const refGroup = ref<FilterGroup>(props.group);
  const entityProperties = ref<EntityProperty[]>([]);

  const emits = defineEmits(['remove']);

  watchEffect(async () => {
    if (refGroup.value && (!refGroup.value.level || refGroup.value.level < 1)) {
      groupInit(refGroup.value);
    }
    if (refGroup.value) {
      if (!props.entity) {
        entityProperties.value = [];
        return;
      }
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
    console.log('addGroup', refGroup.value.level);
    let newGroup = cloneDeep(defFilterGroup);
    newGroup.level = (refGroup.value.level || 1) + 1;
    refGroup.value.groups.push(newGroup);
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
    if (!refGroup.value.rules) {
      refGroup.value.rules = [];
    }
    refGroup.value.rules.push(newRule);
  }

  function fireRemove() {
    emits('remove', refGroup.value);
  }

  function handleRemoveGroup(removedGroup: FilterGroup) {
    const index = refGroup.value.groups.indexOf(removedGroup);
    if (index !== -1) {
      refGroup.value.groups.splice(index, 1);
    }
  }

  function handleRemoveRule(removedRule: FilterRule) {
    const index = refGroup.value.rules.indexOf(removedRule);
    if (index !== -1) {
      refGroup.value.rules.splice(index, 1);
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
