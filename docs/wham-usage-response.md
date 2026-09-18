# Codex `wham/usage` 响应字段说明

本文说明 Codex Idea Tool 调用以下接口时返回的额度数据：

```text
GET https://chatgpt.com/backend-api/wham/usage
```

> 注意：这是 ChatGPT/Codex 当前使用的内部接口，不是稳定的公开 API。字段名称、结构和业务规则未来可能变化。程序应容忍字段缺失、字段为 `null` 和新增字段。

## 当前响应概览

这份样例表示：

- 账号套餐是 `plus`。
- 接口只返回了一个额度窗口。
- 该窗口长度是 `604800` 秒，即 7 天，因此它是周额度，不是 5 小时额度。
- 周额度已使用 `100%`，剩余基础额度为 `0%`。
- 周额度预计在北京时间 `2026-09-19 16:42:55` 重置。
- 当前仍允许请求，且账号存在额外 credits，余额为 `250`。
- 没有可用的免费额度重置次数。

## 顶层字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `user_id` | `string` | ChatGPT 用户标识。用于区分用户，不应作为界面账号名称。 |
| `account_id` | `string` | 当前 ChatGPT 工作区或账户标识。请求接口时通常通过 `Chatgpt-Account-Id` 请求头传递。 |
| `email` | `string` | 当前登录账号邮箱，适合用作账号显示名称。 |
| `plan_type` | `string` | 套餐类型。本例为 `plus`，常见值可能还有 `free`、`pro`、`team` 等。程序不应假设值集合固定。 |
| `rate_limit` | `object` | Codex 主额度限制信息。 |
| `code_review_rate_limit` | `object \| null` | Code Review 功能的独立额度。`null` 表示本次没有该类额度数据。 |
| `additional_rate_limits` | `object/array \| null` | 其他模型或功能的额外额度限制。`null` 表示没有返回。 |
| `model_usage` | `object` | 按模型返回的可用状态。 |
| `credits` | `object` | 额外付费 credits、余额和估算可发送消息数。 |
| `spend_control` | `object` | 消费上限控制状态。 |
| `rate_limit_reached_type` | `object \| null` | 触发额度限制时的原因。本例为 `null`，表示当前没有生效的限制原因。 |
| `promo` | `object \| null` | 促销或赠送额度信息。本例没有。 |
| `rate_limit_reset_credits` | `object` | 可用于手动重置额度窗口的次数。 |

## `rate_limit`

```json
{
  "allowed": true,
  "limit_reached": false,
  "primary_window": { ... },
  "secondary_window": null
}
```

| 字段 | 含义 |
| --- | --- |
| `allowed` | 服务当前是否允许继续发起 Codex 请求。判断账号能否使用时，应优先参考该字段。 |
| `limit_reached` | 当前是否因主额度限制而被阻止。 |
| `primary_window` | 接口返回的第一个额度窗口。它不固定代表 5 小时，必须结合 `limit_window_seconds` 判断。 |
| `secondary_window` | 第二个额度窗口。可能为 `null`。同样应按窗口秒数识别，不应只依赖字段名称。 |

本例虽然窗口 `used_percent=100`，但 `allowed=true` 且 `limit_reached=false`。结合 `credits.has_credits=true` 推断：基础周额度已经用完，但额外 credits 仍可能让账号继续使用。该关系是根据当前响应推断，最终是否能发起请求仍以服务端实际结果为准。

## 额度窗口

```json
{
  "used_percent": 100,
  "limit_window_seconds": 604800,
  "reset_after_seconds": 86897,
  "reset_at": 1789807375
}
```

| 字段 | 含义 | 本例 |
| --- | --- | --- |
| `used_percent` | 已使用比例，范围通常为 0-100。界面剩余比例应按 `100 - used_percent` 计算。 | 已用 100%，剩余 0%。 |
| `limit_window_seconds` | 窗口总长度，单位为秒。它是识别窗口类型的可靠依据。 | `604800` 秒，即 7 天。 |
| `reset_after_seconds` | 从响应生成时刻起，距离重置还有多少秒。 | `86897` 秒，约 1 天 8 分 17 秒。 |
| `reset_at` | 重置时间的 Unix 时间戳，单位为秒。 | 北京时间 `2026-09-19 16:42:55`。 |

当前已知的窗口识别规则：

| 秒数 | 窗口类型 |
| --- | --- |
| `18000` | 5 小时额度 |
| `604800` | 一周额度 |

如果以后出现其他秒数，应按实际时长展示，不要强制归入现有两种窗口。

## `model_usage`

```json
{
  "gpt-6-astra": {
    "available": true,
    "available_at": null,
    "credits_would_enable": false
  }
}
```

| 字段 | 含义 |
| --- | --- |
| `available` | 当前模型是否可用。 |
| `available_at` | 模型不可用时，预计恢复可用的时间；`null` 通常表示当前可用或没有恢复时间。 |
| `credits_would_enable` | 购买或使用 credits 是否能让该模型恢复可用。`false` 表示当前不需要 credits 解锁，或 credits 不能改变其状态。 |

`model_usage` 的键是模型 ID，未来可能同时返回多个模型。

## `credits`

| 字段 | 含义 |
| --- | --- |
| `has_credits` | 账号是否拥有额外 credits。 |
| `unlimited` | credits 是否不设余额上限。 |
| `overage_limit_reached` | 是否已达到额外用量或超额消费上限。 |
| `balance` | credits 余额。接口以字符串返回，程序解析时不要直接假设为整数。 |
| `approx_local_messages` | 按不同消耗场景估算的本地任务消息数量范围。数组通常表示最低和最高估算值。 |
| `approx_cloud_messages` | 按不同消耗场景估算的云端任务消息数量范围。 |

`approx_local_messages` 和 `approx_cloud_messages` 是估算值，不是保证可发送的准确次数。不同模型、推理强度和任务长度都会影响实际消耗。

## `spend_control`

| 字段 | 含义 |
| --- | --- |
| `reached` | 是否达到消费控制上限。 |
| `individual_limit` | 个人消费上限；`null` 表示接口没有返回个人上限。 |

## `rate_limit_reached_type`

未触发限制时通常为 `null`。触发时可能类似：

```json
{
  "type": "rate_limit_reached",
  "details": "default"
}
```

其中 `type` 表示限制类别，`details` 提供更具体的限制来源。该对象的字段可能继续扩展。

## `rate_limit_reset_credits`

| 字段 | 含义 |
| --- | --- |
| `available_count` | 当前拥有的可用重置次数。 |
| `applicable_available_count` | 当前额度状态下实际可以使用的重置次数。 |

本例两个字段都是 `0`，因此界面中的“重置”按钮应禁用。即使 `available_count` 大于 0，如果 `applicable_available_count` 为 0，也不一定允许对当前窗口执行重置。

## 程序解析建议

1. 使用 `limit_window_seconds` 判断 5 小时或一周窗口，不把 `primary_window` 固定等同于 5 小时。
2. 使用 `100 - used_percent` 计算剩余百分比，并限制在 0-100 范围内。
3. 允许任意窗口为 `null`，单个窗口缺失不应导致整个额度功能失败。
4. 以 `allowed` 和 `limit_reached` 判断当前是否被主额度阻止，不只看 `used_percent`。
5. 把 `balance` 当作十进制字符串处理，避免浮点精度损失。
6. 界面展示重置按钮时，同时检查可用次数和适用次数。
7. 额度接口失败、超时或结构变化时，只降级额度模块，不影响软件其他功能。

## 日志中的转义字符

你复制出的 `&#x20;`、`\_` 和 `\@` 不是接口原始字段的一部分，而是日志内容在富文本环境中复制时产生的 HTML/Markdown 转义：

- `&#x20;` 表示空格。
- `\_` 实际是 `_`。
- `\@` 实际是 `@`。

程序收到的 JSON 字段仍是普通的 `user_id`、`account_id`、`primary_window` 等名称。
