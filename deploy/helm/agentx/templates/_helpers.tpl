{{- define "agentx.fullname" -}}
{{- printf "%s-%s" .Release.Name "api" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
