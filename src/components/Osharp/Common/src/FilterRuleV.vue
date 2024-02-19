<template>
  <Row class="rule-box">
    <Col span="24">
      <Select v-model:value="rule.field" size="small" @change="handleFieldChange" style="width: 200px">
        <SelectOption v-for="p in props.properties" :key="p.name" :value="p.name">{{ p.display }}</SelectOption>
      </Select>
      <Select v-model:value="rule.operate" size="small" style="width: 100px">
        <SelectOption v-for="entry in operateEntries" :key="getHashCode(entry.operate)" :value="entry.operate">{{ entry.display }}</SelectOption>
      </Select>
      <template v-if="property?.typeName == 'System.Boolean'">
        <!-- <Select v-model:value="rule.value" size="small" style="width: 150px">
          <SelectOption value="true">是</SelectOption>
          <SelectOption value="false">否</SelectOption>
        </Select> -->
        <Switch v-model:checked="rule.value" size="small" />
      </template>
      <template v-else-if="property?.typeName == 'System.Int32' || property?.typeName == 'System.Int64'">
        <template v-if="property?.valueRange.length == 0">
          <InputNumber v-model:value="rule.value" size="small" style="width: 150px" />
        </template>
        <template v-else>
          <Select v-model:value="rule.value" size="small" style="width: 150px">
            <SelectOption v-for="item in property.valueRange" :key="item.id" :value="item.id">{{ item.text }}</SelectOption>
          </Select>
        </template>
      </template>
      <template v-else-if="property?.typeName == 'System.DateTime'">
        <DatePicker v-model:value="rule.value" size="small" show-time style="width: 150px" />
      </template>
      <template v-else>
        <Input v-model:value="rule.value" size="small" style="width: 150px" />
      </template>
      <Button size="small" @click="fireRemove(rule)" style="margin-left: 8px">删除</Button>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
  import { PropType, ref, onMounted } from 'vue';
  import { Row, Col, Select, SelectOption, DatePicker, Input, InputNumber, Switch, Button } from 'ant-design-vue';
  import { SelectValue } from 'ant-design-vue/es/select';
  import { FilterRule, EntityProperty, FilterOperate, FilterOperateEntry, getHashCode } from '/@/utils/osharp';

  const props = defineProps({
    rule: { type: Object as PropType<FilterRule>, required: true },
    properties: { type: Array as PropType<EntityProperty[]>, required: true },
  });
  const emits = defineEmits(['remove']);

  const rule = ref(props.rule);
  const operateEntries = ref<FilterOperateEntry[]>([]);
  const property = ref<EntityProperty>();

  onMounted(() => {
    fieldChange(rule.value.field);
  });

  function handleFieldChange(value: SelectValue) {
    const field = value as string;
    rule.value.field = field;
  }

  function fireRemove(rule: FilterRule) {
    emits('remove', rule);
  }

  function fieldChange(field: string) {
    if (field == null || field == undefined || field == '') {
      return;
    }
    if (!props.properties || props.properties.length < 1) {
      return;
    }
    property.value = props.properties.find((m) => m.name === field);
    if (!property.value) {
      return;
    }

    let entries: FilterOperateEntry[] = [];
    switch (property.value.typeName) {
      case 'System.Boolean':
        entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
        if (!rule.value.value) {
          rule.value.value = false;
        }
        break;
      case 'System.Guid':
        entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
        if (!rule.value.value) {
          rule.value.value = '';
        }
        break;
      case 'System.Int32':
      case 'System.Int64':
        if (property.value.valueRange.length == 0) {
          //数值类型
          entries = getOperateEntries([
            FilterOperate.Equal,
            FilterOperate.NotEqual,
            FilterOperate.Less,
            FilterOperate.LessOrEqual,
            FilterOperate.Greater,
            FilterOperate.GreaterOrEqual,
          ]);
          if (!rule.value.value) {
            rule.value.value = 0;
          }
        } else {
          //枚举类型
          entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
          if (!rule.value.value) {
            rule.value.value = property.value.valueRange[0].id;
          }
        }
        break;
      case 'System.DateTime':
        entries = getOperateEntries([
          FilterOperate.Equal,
          FilterOperate.NotEqual,
          FilterOperate.Less,
          FilterOperate.LessOrEqual,
          FilterOperate.Greater,
          FilterOperate.GreaterOrEqual,
        ]);
        if (!rule.value.value) {
          rule.value.value = new Date();
        }
        break;
      case 'System.String':
        entries = getOperateEntries([
          FilterOperate.Equal,
          FilterOperate.NotEqual,
          FilterOperate.StartsWith,
          FilterOperate.EndsWith,
          FilterOperate.Contains,
          FilterOperate.NotContains,
        ]);
        if (!rule.value.value) {
          rule.value.value = '';
        }
        break;
      default:
        entries = getOperateEntries([
          FilterOperate.Equal,
          FilterOperate.NotEqual,
          FilterOperate.Less,
          FilterOperate.LessOrEqual,
          FilterOperate.Greater,
          FilterOperate.GreaterOrEqual,
          FilterOperate.StartsWith,
          FilterOperate.EndsWith,
          FilterOperate.Contains,
          FilterOperate.NotContains,
        ]);
        if (!rule.value.value) {
          rule.value.value = '';
        }
        break;
    }
    operateEntries.value = entries;
    if (!rule.value.operate || !operateEntries.value.find((m) => m.operate === rule.value.operate)) {
      rule.value.operate = operateEntries.value[0].operate;
    }
  }

  function getOperateEntries(operates: FilterOperate[]): FilterOperateEntry[] {
    let entries: FilterOperateEntry[] = [];
    operates.forEach((operate) => {
      entries.push(new FilterOperateEntry(operate));
    });
    return entries;
  }
</script>
<style lang="less" scoped>
  .rule-box {
    margin: 3px;
  }
</style>
